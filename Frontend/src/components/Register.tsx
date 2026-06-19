import { useState } from "react";
import { UserPlus } from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.text();
      if (res.ok) {
        setSuccess(true);
      } else {
        alert(data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-purple/10 flex items-center justify-center mx-auto mb-3">
            <UserPlus className="w-6 h-6 text-purple" />
          </div>
          <h1 className="text-xl font-bold text-navy">Buat akun baru</h1>
          <p className="text-sm text-slate-500 mt-1">Mulai kelola jadwal Anda hari ini</p>
        </div>

        {success && (
          <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 text-center">
            Akun berhasil dibuat!{" "}
            <a href="/login" className="font-medium underline">Masuk sekarang</a>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Email</label>
            <input
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/20 focus:border-purple transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Password</label>
            <input
              type="password"
              placeholder="Min. 8 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/20 focus:border-purple transition-all"
            />
          </div>
        </div>

        <button
          onClick={handleRegister}
          disabled={loading || success}
          className="w-full mt-6 py-2.5 px-4 bg-purple text-white text-sm font-medium rounded-xl hover:bg-purple-light transition-colors disabled:opacity-60"
        >
          {loading ? "Memproses..." : "Daftar"}
        </button>

        <p className="text-center text-sm text-slate-500 mt-4">
          Sudah punya akun?{" "}
          <a href="/login" className="text-purple font-medium hover:underline">Masuk</a>
        </p>
      </div>
    </div>
  );
}