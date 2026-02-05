import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionManager from "./session-manager";
import { ToastContainer } from "@/components/toast";
import { ConfirmDialogProvider } from "@/components/confirm-dialog";
import AuthGuard from "@/components/auth-guard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kullanıcı Yönetim Sistemi",
  description: "Next.js ve Supabase ile Kullanıcı Yönetimi",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-50`}
      >
        <ConfirmDialogProvider>
          <AuthGuard>
            <SessionManager />
            <ToastContainer />
            {children}
          </AuthGuard>
        </ConfirmDialogProvider>
      </body>
    </html>
  );
}
