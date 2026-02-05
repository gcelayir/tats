import Link from "next/link";
import { Lock } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center bg-slate-950">
      <div className="bg-slate-900/50 p-4 rounded-full mb-6 border border-slate-800">
        <Lock className="w-8 h-8 text-emerald-500" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-4 text-slate-100">
        Kullanıcı Yönetim Sistemi
      </h1>
      <p className="text-lg text-slate-400 mb-8 max-w-md">
        Güvenli, hızlı ve minimalist yönetim paneli. Devam etmek için giriş yapın.
      </p>
      <Link
        href="/login"
        className="px-8 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40"
      >
        Giriş Yap
      </Link>
    </div>
  );
}
