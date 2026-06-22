import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  Send,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Logo } from "./Logo";
import { useAppContext } from "../context/AppContext";

type ForgotStep =
  | "none"
  | "email_input"
  | "choose_method"
  | "verify_last_password"
  | "verify_otp"
  | "success";

export const AuthModal = ({
  isOpen,
  onClose,
  onLogin,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const { executeWithFeedback } = useAppContext();

  // Input states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Forgot password flow states
  const [forgotStep, setForgotStep] = useState<ForgotStep>("none");
  const [lastPassword, setLastPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [otpGenerated, setOtpGenerated] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [validationError, setValidationError] = useState("");
  const { loginUser } = useAppContext();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      return;
    }

    try {
      const endpoint = isLogin
        ? `${import.meta.env.VITE_BACKEND_API_URL}/auth/login`
        : `${import.meta.env.VITE_BACKEND_API_URL}/auth/register`;

      const bodyData = isLogin
        ? {
            email,
            password,
          }
        : {
            name,
            email,
            password,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result);
      }

      if (isLogin) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        loginUser(result.token, result.user);

        onLogin();
        onClose();
      } else {
        setIsLogin(true);
      }
    } catch (error: any) {
      alert(error.message || "Terjadi kesalahan");
    }
  };

  const handleGoogleAuth = async () => {
    alert("Fitur Google Login sedang dalam pengembangan");
  };

  const startForgotPassword = () => {
    setForgotStep("email_input");
    setValidationError("");
    setOtpInput("");
  };

  // PERBAIKAN: Fungsi Firebase di-mocking sementara supaya tidak crash
  const mockApiCall = async () =>
    new Promise((resolve) => setTimeout(resolve, 800));

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setValidationError("Silakan masukkan email Anda.");
      return;
    }
    setValidationError("");
    executeWithFeedback(async () => {
      await mockApiCall(); // Ganti dengan fetch ke endpoint forgot-password backend kamu nanti
      setForgotStep("success");
    }, `Email pemulihan kata sandi aman berhasil dikirim ke ${email}! Silakan cek inbox Anda.`);
  };

  const sendOtpCode = () => {
    setValidationError("");
    executeWithFeedback(async () => {
      await mockApiCall();
      setForgotStep("success");
    }, `Email pemulihan kata sandi aman berhasil dikirim ke ${email}! Silakan cek inbox Anda.`);
  };

  const handleResetWithLastPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    executeWithFeedback(async () => {
      await mockApiCall();
      setForgotStep("success");
    }, `Tautan pemulihan kata sandi terverifikasi telah dikirim ke ${email}!`);
  };

  const handleResetWithOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    executeWithFeedback(async () => {
      await mockApiCall();
      setForgotStep("success");
    }, `Tautan pemulihan kata sandi terverifikasi telah dikirim ke ${email}!`);
  };

  const resetAllAndGoToLogin = () => {
    setForgotStep("none");
    setIsLogin(true);
    setValidationError("");
    setLastPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setOtpInput("");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-full transition-colors z-10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 overflow-y-auto max-h-[85vh]">
            <div className="flex justify-center mb-4">
              <Logo className="h-8 text-navy" />
            </div>

            {forgotStep === "none" && (
              <>
                <h2 className="text-xl font-bold text-center text-navy mb-1">
                  HeyJipro
                </h2>
                <p className="text-center text-slate-500 mb-5 text-sm">
                  {isLogin
                    ? "Masukkan email dan sandi untuk mengakses dashboard."
                    : "Mulai rancang masa depan akademik Anda hari ini."}
                </p>

                <div className="flex p-1 bg-slate-100 rounded-xl mb-5">
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${isLogin ? "bg-white text-navy shadow-sm" : "text-slate-500 hover:text-navy cursor-pointer"}`}
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${!isLogin ? "bg-white text-navy shadow-sm" : "text-slate-500 hover:text-navy cursor-pointer"}`}
                  >
                    Daftar Baru
                  </button>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    className="w-full flex justify-center items-center gap-3 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
                  >
                    <img
                      src="/src/assets/images/GooglePic.jpg"
                      alt="Google"
                      className="w-4 h-4"
                    />
                    {isLogin ? "Masuk dengan Google" : "Daftar dengan Google"}
                  </button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-white text-slate-500 font-semibold">
                        Atau cara manual
                      </span>
                    </div>
                  </div>

                  {!isLogin && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Nama Lengkap
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/20 focus:border-purple/50 transition-all text-navy font-medium"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Alamat Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/20 focus:border-purple/50 transition-all text-navy font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/20 focus:border-purple/50 transition-all text-navy font-medium"
                      />
                    </div>
                    {isLogin && (
                      <div className="flex justify-end mt-1.5">
                        <button
                          type="button"
                          onClick={startForgotPassword}
                          className="text-xs text-purple hover:text-soft-blue font-bold cursor-pointer hover:underline"
                        >
                          Lupa password?
                        </button>
                      </div>
                    )}
                  </div>

                  {!isLogin && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                        Konfirmasi Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-11 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/20 focus:border-purple/50 transition-all text-navy font-medium"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 mt-2 bg-gradient-to-r from-purple to-soft-blue text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-purple/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLogin ? "Masuk Sekarang" : "Buat Akun"}{" "}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}

            {/* FORGOT PASSWORD FLOW ... (Tidak ada perubahan UI, hanya fungsi submit yang diperbaiki di atas) */}
            {forgotStep === "email_input" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <button
                  type="button"
                  onClick={resetAllAndGoToLogin}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-navy cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Login
                </button>
                <h3 className="text-lg font-bold text-navy flex items-center gap-2 mt-2">
                  <KeyRound className="w-5 h-5 text-purple" /> Lupa Kata Sandi?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Masukkan email akun HeyJipro Anda di bawah ini.
                </p>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/20 focus:border-purple/50 transition-all text-navy font-semibold"
                      />
                    </div>
                  </div>
                  {validationError && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {validationError}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-purple text-white text-sm font-bold rounded-xl hover:bg-purple/90 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Lanjutkan Verifikasi <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            )}

            {forgotStep === "choose_method" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <button
                  type="button"
                  onClick={() => setForgotStep("email_input")}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-navy cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Kembali
                </button>
                <h3 className="text-lg font-bold text-navy flex items-center gap-2 mt-2">
                  <ShieldCheck className="w-5 h-5 text-purple" /> Pilih Cara
                  Verifikasi
                </h3>
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => {
                      setForgotStep("verify_last_password");
                    }}
                    className="w-full text-left p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-purple/60 hover:bg-purple/5 transition-all cursor-pointer group"
                  >
                    <h4 className="text-xs font-bold text-navy">
                      Klarifikasi via Kata Sandi Terakhir
                    </h4>
                  </button>
                  <button
                    onClick={sendOtpCode}
                    className="w-full text-left p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-purple/60 hover:bg-purple/5 transition-all cursor-pointer group"
                  >
                    <h4 className="text-xs font-bold text-navy">
                      Layanan Kode OTP Email
                    </h4>
                  </button>
                </div>
              </motion.div>
            )}

            {forgotStep === "verify_last_password" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <button
                  type="button"
                  onClick={() => setForgotStep("choose_method")}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-navy cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Kembali
                </button>
                <form
                  onSubmit={handleResetWithLastPassword}
                  className="space-y-3.5 pt-1"
                >
                  <input
                    type="password"
                    required
                    value={lastPassword}
                    onChange={(e) => setLastPassword(e.target.value)}
                    placeholder="Sandi Terakhir"
                    className="w-full px-4 py-2 text-sm border rounded-xl"
                  />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Sandi Baru"
                    className="w-full px-4 py-2 text-sm border rounded-xl"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-purple to-soft-blue text-white text-sm font-bold rounded-xl"
                  >
                    Simpan Sandi Baru
                  </button>
                </form>
              </motion.div>
            )}

            {forgotStep === "verify_otp" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <button
                  type="button"
                  onClick={() => setForgotStep("choose_method")}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-navy cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Kembali
                </button>
                <form onSubmit={handleResetWithOtp} className="space-y-3.5">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="123456"
                    className="w-full px-4 py-2 text-sm text-center tracking-widest border rounded-xl"
                  />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Sandi Baru"
                    className="w-full px-4 py-2 text-sm border rounded-xl"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-purple to-soft-blue text-white text-sm font-bold rounded-xl"
                  >
                    Simpan Sandi Baru
                  </button>
                </form>
              </motion.div>
            )}

            {forgotStep === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-4"
              >
                <div className="flex justify-center">
                  <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">
                  Sandi Berhasil Dipulihkan!
                </h3>
                <button
                  onClick={resetAllAndGoToLogin}
                  className="w-full py-2.5 bg-navy text-white text-xs font-bold rounded-xl"
                >
                  Kembali ke Form Log In
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
