import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginClient from "./LoginClient";

const USER_COOKIE = "user_session";

export default async function UserLoginPage() {
  // If user is already logged in, send them to dashboard
  const cookieStore = await cookies();
  const userId = cookieStore.get(USER_COOKIE)?.value;
  if (userId) {
    redirect("/user/dashboard");
  }

  return <LoginClient />;
}
