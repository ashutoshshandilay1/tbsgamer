import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TBS GAMER — Earn ₹100 Per App Rating",
  description: "Rate apps on Google Play Store and earn ₹100 per rating. Withdraw instantly via UPI!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
