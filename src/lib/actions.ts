"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const ADMIN_COOKIE = "admin_session";
const USER_COOKIE = "user_session";

// ── User Auth (Custom) ──
export async function userSignupAction(formData: FormData) {
  const full_name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;

  if (!full_name || !email || !phone || !password) return { error: "All fields are required" };

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Note: This requires updating the profiles table to not depend on auth.users
  const { data, error } = await supabase.from("profiles").insert([{
    full_name,
    email,
    phone,
    password // Ensure password column exists in profiles table
  }]).select().single();

  if (error) {
    if (error.code === '23505') return { error: "Email or phone already registered" };
    return { error: error.message };
  }

  cookieStore.set(USER_COOKIE, data.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  redirect("/user/dashboard");
}

export async function userLoginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Please fill all fields" };

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.from("profiles")
    .select("id, is_banned, ban_reason")
    .eq("email", email)
    .eq("password", password)
    .single();

  if (error || !data) return { error: "Invalid email or password" };
  if (data.is_banned) {
    return { error: `Banned: ${data.ban_reason || "Violation of terms"}` };
  }

  cookieStore.set(USER_COOKIE, data.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  redirect("/user/dashboard");
}

export async function getUserProfile() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(USER_COOKIE)?.value;
  if (!userId) return null;
  const supabase = createClient(cookieStore);
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (data?.is_banned) {
    cookieStore.delete(USER_COOKIE); // Auto logout banned users
    return null;
  }
  return data;
}

export async function userLogout() {
  const cookieStore = await cookies();
  cookieStore.delete(USER_COOKIE);
  redirect("/user/login");
}

// ── Admin Auth ──
export async function loginAction(email: string, password: string) {
  if (email !== "ashucodedev@gmail.com" || password !== process.env.ADMIN_PASSWORD) {
    return { error: "Invalid email or password" };
  }
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === "authenticated";
}

// ── Apps CRUD ──
export async function createApp(data: {
  name: string;
  description: string;
  icon_url: string;
  play_store_url: string;
  reward_amount: number;
  active: boolean;
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.from("apps").insert(data);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteApp(id: number) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.from("apps").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function toggleApp(id: number, active: boolean) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.from("apps").update({ active }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

// ── Nav Items CRUD ──
export async function createNavItem(data: { name: string; link: string; position: number }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.from("nav_items").insert(data);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/navigation");
  return { success: true };
}

export async function deleteNavItem(id: number) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.from("nav_items").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/navigation");
  return { success: true };
}

// ── Users Management ──
export async function adjustUserBalance(userId: string, amount: number, type: 'add' | 'deduct') {
  if (amount <= 0) return { error: "Amount must be greater than zero" };

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Get current balance
  const { data: profile, error: getErr } = await supabase.from("profiles").select("wallet_balance").eq("id", userId).single();
  if (getErr || !profile) return { error: "User not found" };

  const currentBalance = profile.wallet_balance || 0;
  const newBalance = type === 'add' ? currentBalance + amount : currentBalance - amount;

  // Don't let it go below 0
  if (newBalance < 0) return { error: "Cannot deduct more than the user's current balance" };

  const { error } = await supabase.from("profiles").update({ wallet_balance: newBalance }).eq("id", userId);
  if (error) return { error: error.message };
  
  // Log Transaction
  await supabase.from("transactions").insert({
    user_id: userId,
    amount: amount,
    type: type === 'add' ? 'credit' : 'debit',
    description: type === 'add' ? "Gift from Administrator" : "Deducted by Administrator"
  });

  revalidatePath("/admin/users", "layout");
  revalidatePath("/user/dashboard");
  return { success: true };
}

export async function toggleUserBan(userId: string, isBanned: boolean, banReason: string = "") {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.from("profiles").update({ 
    is_banned: isBanned, 
    ban_reason: isBanned ? banReason : null 
  }).eq("id", userId);
  
  if (error) return { error: error.message };
  revalidatePath("/admin/users", "layout");
  return { success: true };
}

// ── Proofs ──
export async function submitProof(appId: number, base64Image: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const user = await getUserProfile();
  if (!user) return { error: "You must be logged in to submit proof." };

  const { error } = await supabase.from("proofs").insert({
    user_id: user.id,
    app_id: appId,
    image_base64: base64Image,
    status: 'pending'
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function approveProof(proofId: number, userId: string, amount: number) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Get current user balance to add to it and fetch proof/app details
  const { data: profile } = await supabase.from("profiles").select("wallet_balance, total_earned").eq("id", userId).single();
  if (!profile) return { error: "User not found" };

  const { data: proof } = await supabase.from("proofs").select("app_id, apps(name)").eq("id", proofId).single();

  const { error: pErr } = await supabase.from("profiles").update({
    wallet_balance: profile.wallet_balance + amount,
    total_earned: profile.total_earned + amount
  }).eq("id", userId);

  if (pErr) return { error: pErr.message };

  const { error } = await supabase.from("proofs").update({
    status: 'approved',
    awarded_amount: amount
  }).eq("id", proofId);

  if (error) return { error: error.message };

  // Log Transaction
  await supabase.from("transactions").insert({
    user_id: userId,
    amount: amount,
    type: 'credit',
    description: `Task Approved: ${(proof as any)?.apps?.name || 'App Rating'}`
  });

  revalidatePath("/admin/proofs");
  revalidatePath("/user/dashboard");
  return { success: true };
}

export async function rejectProof(proofId: number, remark: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.from("proofs").update({
    status: 'rejected',
    remark: remark
  }).eq("id", proofId);

  if (error) return { error: error.message };

  revalidatePath("/admin/proofs");
  return { success: true };
}

// ── Withdrawal System ──
export async function createWithdrawalCategory(data: { name: string; input_label: string; input_placeholder: string; image_url?: string }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.from("withdrawal_categories").insert(data);
  if (error) return { error: error.message };
  revalidatePath("/admin/withdrawals");
  return { success: true };
}

export async function createWithdrawalOption(data: { category_id: number; amount: number }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.from("withdrawal_options").insert(data);
  if (error) return { error: error.message };
  revalidatePath("/admin/withdrawals");
  return { success: true };
}

export async function requestWithdrawal(optionId: number, userInput: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const user = await getUserProfile();
  if (!user) return { error: "Not logged in" };

  // Fetch option details
  const { data: option } = await supabase.from("withdrawal_options")
    .select("*, withdrawal_categories(name)")
    .eq("id", optionId).single();
    
  if (!option) return { error: "Invalid option" };

  if (user.wallet_balance < option.amount) {
    return { error: "Insufficient balance" };
  }

  // Deduct balance
  const { error: pErr } = await supabase.from("profiles")
    .update({ wallet_balance: user.wallet_balance - option.amount })
    .eq("id", user.id);
  if (pErr) return { error: pErr.message };

  // Log transaction
  await supabase.from("transactions").insert({
    user_id: user.id,
    amount: option.amount,
    type: 'debit',
    description: `Withdrawal Request: ${(option as any).withdrawal_categories?.name} (₹${option.amount})`
  });

  // Create request
  const { error } = await supabase.from("withdrawal_requests").insert({
    user_id: user.id,
    option_id: optionId,
    user_input: userInput,
    status: 'pending'
  });

  if (error) return { error: error.message };
  
  revalidatePath("/user/dashboard");
  return { success: true };
}

export async function processWithdrawal(requestId: number, action: 'approve' | 'reject', remark?: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: req } = await supabase.from("withdrawal_requests")
    .select("*, withdrawal_options(amount, withdrawal_categories(name))")
    .eq("id", requestId).single();
    
  if (!req) return { error: "Request not found" };

  if (action === 'approve') {
    const { error } = await supabase.from("withdrawal_requests").update({ 
      status: 'approved',
      admin_remark: remark || null
    }).eq("id", requestId);
    if (error) return { error: error.message };
  } else {
    // Refund user
    const { data: profile } = await supabase.from("profiles").select("wallet_balance").eq("id", req.user_id).single();
    if (profile) {
      await supabase.from("profiles").update({ wallet_balance: profile.wallet_balance + (req as any).withdrawal_options.amount }).eq("id", req.user_id);
      
      // Log Refund Transaction
      await supabase.from("transactions").insert({
        user_id: req.user_id,
        amount: (req as any).withdrawal_options.amount,
        type: 'credit',
        description: `Refund: Rejected Withdrawal for ${(req as any).withdrawal_options.withdrawal_categories?.name}`
      });
    }
    const { error } = await supabase.from("withdrawal_requests").update({ status: 'rejected' }).eq("id", requestId);
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/withdrawals");
  revalidatePath("/user/dashboard");
  revalidatePath("/user/withdraw/history");
  return { success: true };
}

// ── Support Tickets ──
export async function submitSupportTicket(message: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("support_tickets").insert({
    user_id: user.id,
    message
  });

  if (error) return { error: error.message };
  return { success: true };
}
