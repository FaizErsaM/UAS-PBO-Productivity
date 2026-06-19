import { useState } from "react";
import { LogOut, User } from "lucide-react";

export default function Logout() {
  const [loading, setLoading] = useState(false);
  const user = localStorage.getItem("user");

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("http://localhost:8080/api/auth/logout", { method: "POST" });
      localStorage.removeItem("user");
      window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-xl border border-slate-200 bg-white w-fit">
      <div className="w-7 h-7 rounded-full bg-purple/10 flex items-center justify-center">
        <User className="w-4 h-4 text-purple" />
      </div>
      <span className="text-sm text-slate-600 font-medium">{user ?? "Pengguna"}</span>
      <button
        onClick={handleLogout}
        disabled={loading}
        className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium transition-colors disabled:opacity-60 ml-2"
      >
        <LogOut className="w-4 h-4" />
        {loading ? "Keluar..." : "Keluar"}
      </button>
    </div>
  );
}