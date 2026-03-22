"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/lib/api";
import { saveAuthSession } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@palareng.id");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        className="card-panel w-full max-w-md rounded-[2rem] p-8"
        onSubmit={async (event) => {
          event.preventDefault();
          setError("");

          try {
            const result = await loginAdmin(email, password);
            if (result.user.role === "warga") {
              setError("Akun masyarakat tidak bisa masuk ke dashboard admin.");
              return;
            }
            saveAuthSession(result.token, result.user, "admin");
            router.replace("/admin/dashboard");
          } catch {
            setError("Login gagal. Pastikan Laravel API sudah berjalan dan kredensial benar.");
          }
        }}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-700">Admin Portal</p>
        <h1 className="mt-3 font-serif text-3xl font-bold">Masuk ke Dashboard</h1>
        <div className="mt-6 space-y-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Email" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Password" />
          {error ? <p className="text-sm text-rose-700">{error}</p> : null}
          <button className="w-full rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white">Login</button>
        </div>
      </form>
    </div>
  );
}
