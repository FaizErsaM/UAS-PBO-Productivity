import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Target,
  Lock,
  Flame,
  ArrowRight,
  Frown,
  Clock,
  HelpCircle,
  Activity,
  CheckSquare,
  BarChart3,
  PlusCircle,
  ListOrdered,
  Focus,
  TrendingUp,
  Check,
  LayoutDashboard,
  Instagram,
  Linkedin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Logo } from "./Logo";
import { AuthModal } from "./AuthModal";
import { PaperConfetti } from "./PaperConfetti";
import emptyAnimeStudyRoom from "../assets/images/empty_anime_study_room_1780219699619.png";
import { useAppContext } from "../context/AppContext";

// ── Foto creator dari assets ──────────────────────────────────────────────
import photoAbdulKarim from "../assets/images/karim.png";
import photoAdamHalawi from "../assets/images/adam.png";
import photoAdiKarunia from "../assets/images/adi_karunia.png";
import photoAdiSatria from "../assets/images/adi_s.png";
import photoAditya from "../assets/images/aditya.png";
import photoAfdhal from "../assets/images/afdhal.png";
import photoAhmadFadhilah from "../assets/images/ahmet.png";
import photoAhmadRiyadh from "../assets/images/pawas.png";
import photoAika from "../assets/images/aika.png";
import photoAlden from "../assets/images/alden.png";
import photoFahad from "../assets/images/fahad.png";
import photoFaiz from "../assets/images/faiz.png";

// ── 12 Creator Slides (semua sample nama Faiz) ─────────────────────────────
// `instagram` & `linkedin` beda per orang — tombol sosial di bawah carousel
// otomatis ikut berubah sesuai slide yang sedang ditampilkan.
const creatorSlides = [
  {
    id: 1,
    name: "ABDUL KARIM .",
    NIM: " 1247050017",
    emoji: "👨‍💻",
    photo: photoAbdulKarim,
    quote:
      "Saya bangun HeyJipro karena saya tahu betul rasanya kewalahan menghadapi tugas kuliah tanpa sistem yang rapi.",
    accent: "#8B5CF6",
    bg: "lp-slide-purple",
    instagram: "https://www.instagram.com/aabdlkarm/",
    linkedin: "https://www.linkedin.com/in/aabdlkarm/",
  },
  {
    id: 2,
    name: "ADAM HALAWI",
    NIM: " 1247050024",
    emoji: "🎨",
    photo: photoAdamHalawi,
    quote:
      "Saya percaya desain yang baik bukan hanya soal estetika — tapi bagaimana membuat pengguna merasa nyaman dan termotivasi.",
    accent: "#EC4899",
    bg: "lp-slide-pink",
    instagram:
      ": https://www.instagram.com/xxdam.yo?igsh=MTk3OTZ0c21pcnF4aw%3D%3D&utm_source=qr", // contoh placeholder — ganti dengan URL IG asli
    linkedin: " https://www.linkedin.com/in/adam-halawi-73069041a", // contoh placeholder — ganti dengan URL LinkedIn asli
  },
  {
    id: 3,
    name: "ADI KARUNIA",
    NIM: " 12470500127",
    emoji: "⚙️",
    photo: photoAdiKarunia,
    quote:
      "Sistem yang kuat di balik layar adalah kunci agar pengalaman pengguna berjalan mulus tanpa hambatan.",
    accent: "#3B82F6",
    bg: "lp-slide-blue",
    instagram: " https://www.instagram.com/adi_krni?igsh=MXNscDY3cGlmNGhhaA==",
    linkedin:
      " https://www.linkedin.com/in/adi-karunia-8895aa322?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
  {
    id: 4,
    name: "ADI SATRIA PERMANA",
    NIM: " 1247050074",
    emoji: "🎯",
    photo: photoAdiSatria,
    quote:
      "Fitur terbaik adalah fitur yang menyelesaikan masalah nyata. Kami selalu mendengar pengguna sebelum membangun apapun.",
    accent: "#F59E0B",
    bg: "lp-slide-amber",
    instagram: "https://www.instagram.com/adistrprmn?igsh=MTg2b3NlczhjNnNpcQ==",
    linkedin:
      "https://www.linkedin.com/in/adi-satria-permana-undefined-312a56419?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
  {
    id: 5,
    name: "ADITYA RAHMAN SYACH",
    NIM: " 1247050069",
    emoji: "📱",
    photo: photoAditya,
    quote:
      "Produktivitas tidak harus terpaku di depan laptop. Kami memastikan HeyJipro berjalan sempurna di semua perangkat.",
    accent: "#10B981",
    bg: "lp-slide-emerald",
    instagram: "https://www.instagram.com/adityarns_/",
    linkedin: " https://www.linkedin.com/in/aditya-rahman-syach/",
  },
  {
    id: 6,
    name: "AFDHAL JIHADI",
    NIM: " 1247050111",
    emoji: "📊",
    photo: photoAfdhal,
    quote:
      "Data tidak bohong. Setiap keputusan fitur kami didasari oleh data pengguna agar dampaknya benar-benar terasa.",
    accent: "#6366F1",
    bg: "lp-slide-indigo",
    instagram: " https://www.instagram.com/jjhdii?igsh=MTRmYWV3MWo0aGk4OA==",
    linkedin:
      " https://www.linkedin.com/in/afdhal-jihadi-836770322?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
  {
    id: 7,
    name: "AHMAD FADHILAH GUMANTARA",
    NIM: " 1247050047",
    emoji: "🚀",
    photo: photoAhmadFadhilah,
    quote:
      "Infrastruktur yang solid memastikan HeyJipro selalu online dan cepat, kapanpun kamu butuhkan.",
    accent: "#EF4444",
    bg: "lp-slide-red",
    instagram: "https://www.instagram.com/ahmad0f0g?igsh=YXNtZHR3Yzc3a3cy",
    linkedin: "https://www.linkedin.com/in/ahmad-fadhilah-gumantara",
  },
  {
    id: 8,
    name: "AHMAD RIYADH FAWWAZ",
    NIM: " 1247050106",
    emoji: "✍️",
    photo: photoAhmadRiyadh,
    quote:
      "Komunikasi yang jelas dan empati adalah fondasi agar setiap pengguna merasa HeyJipro benar-benar dibuat untuk mereka.",
    accent: "#F97316",
    bg: "lp-slide-orange",
    instagram:
      "https://www.instagram.com/riyadhfwz?igsh=MTJ1eDRnYnlzYTkybw%3D%3D&utm_source=qr",
    linkedin:
      "https://www.linkedin.com/in/pawass-yoi-19668541a?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
  },
  {
    id: 9,
    name: "AIKA RIENASARI",
    NIM: " 1247050085",
    emoji: "🔐",
    photo: photoAika,
    quote:
      "Data kamu adalah milik kamu. Privasi dan keamanan bukan fitur tambahan — itu adalah hak dasar pengguna.",
    accent: "#64748B",
    bg: "lp-slide-slate",
    instagram: "https://www.instagram.com/aikariena?igsh=MWRrODhtaHcxbmY1Yg==",
    linkedin: "https://www.linkedin.com/in/aika-rienasari-75b744351/",
  },
  {
    id: 10,
    name: "ALDEN SHALIH FALAH",
    NIM: " 1247050050",
    emoji: "🧪",
    photo: photoAlden,
    quote:
      "Satu bug yang lolos bisa merusak kepercayaan. Saya memastikan setiap fitur teruji tuntas sebelum sampai ke tanganmu.",
    accent: "#14B8A6",
    bg: "lp-slide-teal",
    instagram: "https://www.instagram.com/dennn.26sf?igsh=aGQxMDNxc3Vna3lt",
    linkedin:
      " https://www.linkedin.com/in/alden-shalih-falah-b5260635b?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
  {
    id: 11,
    name: "FAHAD MUHAMMAD ALFARIZ",
    NIM: " 1247050135",
    emoji: "📈",
    photo: photoFahad,
    quote:
      "Pertumbuhan yang bermakna datang dari komunitas yang puas. Setiap pengguna baru adalah tanda kepercayaan yang kami jaga.",
    accent: "#8B5CF6",
    bg: "lp-slide-violet",
    instagram:
      "https://www.instagram.com/namoradogor?igsh=MWg3YnF0M29reW93dQ%3D%3D&utm_source=qr",
    linkedin: "https://www.linkedin.com/in/fahadalfarizik",
  },
  {
    id: 12,
    name: "FAIZ ERSA MUSYAFA",
    NIM: " 1247050091",
    emoji: "🤝",
    photo: photoFaiz,
    quote:
      "HeyJipro adalah rumah bagi semua orang yang percaya bahwa disiplin diri adalah bentuk cinta pada masa depan sendiri.",
    accent: "#EC4899",
    bg: "lp-slide-fuchsia",
    instagram:
      "https://www.instagram.com/fmsya_?igsh=M2J0NXMybzYzbGdy&utm_source=qr",
    linkedin: "https://www.linkedin.com/in/faiz-ersa-musyafa-6583b3361",
  },
];

export const LandingPage = ({ onLogin }: { onLogin: () => void }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authorStyle, setAuthorStyle] = useState<
    "png" | "twibbon" | "instagram"
  >("png");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDir, setSlideDir] = useState(1);
  const { executeWithFeedback, theme } = useAppContext();
  const isDark = theme === "dark";

  const prevSlide = () => {
    setSlideDir(-1);
    setCurrentSlide(
      (i) => (i - 1 + creatorSlides.length) % creatorSlides.length,
    );
  };
  const nextSlide = () => {
    setSlideDir(1);
    setCurrentSlide((i) => (i + 1) % creatorSlides.length);
  };
  const goToSlide = (idx: number) => {
    setSlideDir(idx > currentSlide ? 1 : -1);
    setCurrentSlide(idx);
  };

  // Inline style tokens for light/dark
  const lp = {
    pageBg: isDark ? "#0F172A" : "#F9FAFB",
    navBg: isDark ? "rgba(15,23,42,0.85)" : "rgba(255,255,255,0.85)",
    navBorder: isDark ? "#1E293B" : "#E2E8F0",
    sectionWhite: isDark ? "#0F172A" : "#FFFFFF",
    sectionGray: isDark ? "#111827" : "#F9FAFB",
    cardBg: isDark ? "#1E293B" : "#FFFFFF",
    cardBorder: isDark ? "#334155" : "#F1F5F9",
    subCardBg: isDark ? "#0F172A" : "#F8FAFC",
    subCardBorder: isDark ? "#334155" : "#F1F5F9",
    textPrimary: isDark ? "#F9FAFB" : "#0F172A",
    textSecondary: isDark ? "#94A3B8" : "#64748B",
    textMuted: isDark ? "#64748B" : "#94A3B8",
    inputBg: isDark ? "#1E293B" : "#FFFFFF",
    inputBorder: isDark ? "#334155" : "#E2E8F0",
    labelColor: isDark ? "#CBD5E1" : "#475569",
    divider: isDark ? "#1E293B" : "#F1F5F9",
    iconWrap: isDark ? "#1E293B" : "#F8FAFC",
    btnSocial: isDark ? "#1E293B" : "#FFFFFF",
    btnSocialBorder: isDark ? "#334155" : "#E2E8F0",
    btnSocialText: isDark ? "#CBD5E1" : "#475569",
    tagBg: isDark ? "#1E293B" : "#FFFFFF",
    tagBorder: isDark ? "#334155" : "#F1F5F9",
    tagText: isDark ? "#94A3B8" : "#94A3B8",
    dotInactive: isDark ? "#334155" : "#CBD5E1",
    arrowBg: isDark ? "#1E293B" : "#FFFFFF",
    arrowBorder: isDark ? "#334155" : "#E2E8F0",
    slideBg: isDark ? "#1E293B" : "#F8FAFC",
    slideBorder: isDark ? "#334155" : "#F1F5F9",
  };

  return (
    <div
      data-page="landing"
      className="min-h-screen font-sans selection:bg-purple selection:text-white relative transition-colors duration-300"
      style={{ backgroundColor: lp.pageBg, color: lp.textPrimary }}
    >
      <PaperConfetti />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={onLogin}
      />

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-md transition-colors duration-300"
        style={{
          borderBottom: `1px solid ${lp.navBorder}`,
          backgroundColor: lp.navBg,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo className={`h-10 ${isDark ? "text-white" : "text-navy"}`} />
          <div className="flex items-center gap-6">
            {(["Masalah", "Solusi", "Cara Kerja"] as const).map((label, i) => (
              <a
                key={i}
                href={`#${label.toLowerCase().replace(" ", "-")}`}
                className="text-sm font-medium hidden md:block transition-colors hover:text-purple"
                style={{ color: lp.textSecondary }}
              >
                {label}
              </a>
            ))}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-6 py-2.5 bg-linear-to-r from-purple to-soft-blue text-white text-sm font-bold rounded-full hover:shadow-lg hover:shadow-purple/30 transition-all cursor-pointer"
            >
              Log in
            </button>
          </div>
        </div>
      </nav>

      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <section
        className="pt-32 pb-20 px-6 overflow-hidden relative transition-colors duration-300"
        style={{ backgroundColor: lp.sectionGray }}
      >
        <div
          className="absolute inset-0 z-0 pointer-events-none bg-cover bg-center"
          style={{
            backgroundImage: `url(${emptyAnimeStudyRoom})`,
            opacity: isDark ? 0.05 : 0.1,
            mixBlendMode: isDark ? "screen" : "multiply",
          }}
        />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1
                className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6 tracking-tight"
                style={{ color: lp.textPrimary }}
              >
                Berhenti Menunda,{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-purple to-soft-blue">
                  Mulai Produktif.
                </span>
              </h1>
              <p
                className="text-lg md:text-xl mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                style={{ color: lp.textSecondary }}
              >
                HeyJipro membantu mahasiswa mengatur tugas, memprioritaskan
                deadline, dan membangun kebiasaan produktif agar tetap fokus
                pada hal yang penting.
              </p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-8 py-4 bg-linear-to-r from-purple to-soft-blue text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple/30 transition-all flex items-center gap-2 mx-auto lg:mx-0"
              >
                Mulai Gratis <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>

          {/* Hero Mockup — always dark themed */}
          <div className="flex-1 w-full max-w-2xl relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
              transition={{
                opacity: { duration: 0.8, delay: 0.2 },
                scale: { duration: 0.8, delay: 0.2 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
              whileHover={{ scale: 1.02 }}
              className="relative z-10 rounded-3xl shadow-2xl overflow-hidden cursor-pointer"
              style={{ border: "1px solid #1E293B" }}
            >
              <div
                className="p-4 flex items-center justify-between"
                style={{
                  backgroundColor: "#1E293B",
                  borderBottom: "1px solid #0F172A",
                }}
              >
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  app.heyjipro.com
                </span>
                <div className="w-10" />
              </div>
              <div className="p-6" style={{ backgroundColor: "#0F172A" }}>
                <div className="flex gap-4 mb-6">
                  <div
                    className="h-20 w-1/3 rounded-xl flex items-center px-4"
                    style={{ backgroundColor: "rgba(139,92,246,0.2)" }}
                  >
                    <div>
                      <div className="text-2xl font-bold text-white">
                        Priority
                      </div>
                      <div className="text-sm text-slate-400">2 tasks</div>
                    </div>
                  </div>
                  <div
                    className="h-20 w-1/3 rounded-xl flex items-center px-4"
                    style={{ backgroundColor: "rgba(59,130,246,0.2)" }}
                  >
                    <div>
                      <div className="text-2xl font-bold text-white">
                        Habits
                      </div>
                      <div className="text-sm text-slate-400">3 ongoing</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div
                    className="p-4 rounded-xl flex justify-between items-center relative overflow-hidden"
                    style={{
                      backgroundColor: "#1E293B",
                      border: "1px solid rgba(239,68,68,0.3)",
                    }}
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                    <div>
                      <h4 className="font-bold text-white">
                        Tugas Akhir Bab 1
                      </h4>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Hari ini
                      </div>
                    </div>
                    <span
                      className="px-3 py-1 text-xs font-bold rounded-lg text-red-400"
                      style={{ backgroundColor: "rgba(239,68,68,0.2)" }}
                    >
                      High Priority
                    </span>
                  </div>
                  <div
                    className="p-4 rounded-xl flex justify-between items-center opacity-50"
                    style={{
                      backgroundColor: "rgba(30,41,59,0.6)",
                      border: "1px solid #1E293B",
                    }}
                  >
                    <h4 className="font-medium text-slate-400">
                      Resume Jurnal
                    </h4>
                    <Lock className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-linear-to-tr from-purple/20 to-soft-blue/20 blur-3xl -z-10 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── 2. Masalah ──────────────────────────────────────────────────── */}
      <section
        id="masalah"
        className="py-24 transition-colors duration-300"
        style={{ backgroundColor: lp.sectionWhite }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="text-center mb-16">
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: lp.textPrimary }}
            >
              Pernah Mengalami Hal Ini?
            </h2>
            <p
              className="max-w-2xl mx-auto text-lg"
              style={{ color: lp.textSecondary }}
            >
              Sebagai mahasiswa, menyeimbangkan kuliah dan kehidupan bisa sangat
              melelahkan.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProblemCard
              icon={<Frown className="w-6 h-6 text-red-500" />}
              text="Tugas menumpuk tanpa arah"
              lp={lp}
              delay={0.1}
            />
            <ProblemCard
              icon={<Clock className="w-6 h-6 text-orange-500" />}
              text="Deadline sering terlupakan"
              lp={lp}
              delay={0.2}
            />
            <ProblemCard
              icon={<HelpCircle className="w-6 h-6 text-yellow-500" />}
              text="Bingung menentukan prioritas"
              lp={lp}
              delay={0.3}
            />
            <ProblemCard
              icon={<Activity className="w-6 h-6 text-blue-500" />}
              text="Produktivitas tidak konsisten"
              lp={lp}
              delay={0.4}
            />
            <ProblemCard
              icon={<Flame className="w-6 h-6 text-purple" />}
              text="Sering belajar mepet deadline (SKS)"
              lp={lp}
              delay={0.5}
            />
          </div>
        </motion.div>
      </section>

      {/* ── 3. Solusi ───────────────────────────────────────────────────── */}
      <section
        id="solusi"
        className="py-24 transition-colors duration-300"
        style={{ backgroundColor: lp.sectionGray }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="text-center mb-16">
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: lp.textPrimary }}
            >
              HeyJipro Membantu Kamu Tetap Terorganisir
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard
              icon={<CheckSquare className="w-6 h-6 text-soft-blue" />}
              title="Smart Task Management"
              desc="Kelola semua tugas dalam satu dashboard. Tidak ada lagi catatan yang tercecer."
              lp={lp}
              delay={0.1}
            />
            <FeatureCard
              icon={<Target className="w-6 h-6 text-red-500" />}
              title="Focus Priority System"
              desc="Kerjakan tugas terpenting terlebih dahulu. Sistem kami mengunci tugas sepele sebelum yang utama selesai."
              lp={lp}
              delay={0.3}
            />
            <FeatureCard
              icon={<Activity className="w-6 h-6 text-orange-500" />}
              title="Habit Tracker"
              desc="Bangun kebiasaan positif setiap hari. Lacak progresmu dalam 30 hari untuk mencapai konsistensi."
              lp={lp}
              delay={0.5}
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6 text-purple" />}
              title="Growth Analytics"
              desc="Lihat perkembangan produktivitasmu. Evaluasi dari waktu ke waktu dan terus jadikan dirimu lebih baik."
              lp={lp}
              delay={0.7}
            />
          </div>
        </motion.div>
      </section>

      {/* ── 4. Cara Kerja — always dark ─────────────────────────────────── */}
      <section
        id="cara-kerja"
        className="py-24 bg-navy text-white overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple/20 blur-[100px] rounded-full" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-6 relative z-10"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Hanya 4 Langkah
            </h2>
            <p className="text-slate-400 text-lg">
              Membangun produktivitas tidak pernah semudah ini.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-[1px] bg-slate-700" />
            <StepCard
              number="1"
              icon={<PlusCircle className="w-8 h-8" />}
              text="Tambahkan tugas dan deadline"
              delay={0.1}
            />
            <StepCard
              number="2"
              icon={<ListOrdered className="w-8 h-8" />}
              text="Sistem mengurutkan prioritas otomatis"
              delay={0.3}
            />
            <StepCard
              number="3"
              icon={<Focus className="w-8 h-8" />}
              text="Fokus mengerjakan tugas teratas"
              delay={0.5}
            />
            <StepCard
              number="4"
              icon={<TrendingUp className="w-8 h-8" />}
              text="Pantau progres dan konsistensi"
              delay={0.7}
            />
          </div>
        </motion.div>
      </section>

      {/* ── 5. Preview Dashboard ────────────────────────────────────────── */}
      <section
        className="py-24 hidden md:block transition-colors duration-300"
        style={{ backgroundColor: lp.sectionWhite }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="text-center mb-16">
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: lp.textPrimary }}
            >
              Intip Dashboard HeyJipro
            </h2>
          </div>
          <div
            className="rounded-3xl p-8 transition-colors duration-300"
            style={{
              backgroundColor: lp.subCardBg,
              border: `1px solid ${lp.cardBorder}`,
            }}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <PreviewCard
                icon={<LayoutDashboard />}
                title="Main Dashboard"
                color="bg-soft-blue/10 text-soft-blue"
                lp={lp}
                delay={0.1}
              />
              <PreviewCard
                icon={<CheckSquare />}
                title="Task Priority Management"
                color="bg-red-500/10 text-red-500"
                lp={lp}
                delay={0.2}
              />
              <PreviewCard
                icon={<Activity />}
                title="Habit Consistency"
                color="bg-orange-500/10 text-orange-500"
                lp={lp}
                delay={0.3}
              />
              <PreviewCard
                icon={<BarChart3 />}
                title="Detailed Analytics"
                color="bg-purple/10 text-purple"
                lp={lp}
                delay={0.4}
              />
            </div>
            <div
              className="mt-8 text-center font-medium"
              style={{ color: lp.textSecondary }}
            >
              ✨ Daftar sekarang untuk melihat langsung! ✨
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── 5.5. Testimonial ────────────────────────────────────────────── */}
      <section
        className="py-24 transition-colors duration-300"
        style={{
          backgroundColor: lp.sectionGray,
          borderTop: `1px solid ${lp.divider}`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="text-center mb-16">
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: lp.textPrimary }}
            >
              Apa Kata Mereka?
            </h2>
            <p className="text-lg" style={{ color: lp.textSecondary }}>
              Mereka sudah membuktikan bahwa HeyJipro sangat membantu
              produktivitas.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <TestiCard
              name="Andi S."
              role="Mahasiswa Teknik"
              feedback="Fitur Deep Work bener-bener membantu saya buat fokus nugas tanpa kedistract. UI/UX nya juga enak banget diliat."
              lp={lp}
              delay={0.1}
            />
            <TestiCard
              name="Rara M."
              role="Content Creator"
              feedback="Sistem penguncian tasknya jenius! Bikin nggak bisa lari dari tugas prioritas. Habit tracker-nya bantu konsisten banget."
              lp={lp}
              delay={0.2}
            />
            <TestiCard
              name="Budi P."
              role="Freelancer"
              feedback="Awalnya sering nunda kerjaan, setelah pake HeyJipro jadi lebih tertata. Sangat minimalis dan to-the-point!"
              lp={lp}
              delay={0.3}
            />
          </div>

          {/* Feedback Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-2xl mx-auto rounded-3xl p-8 transition-colors duration-300"
            style={{
              backgroundColor: lp.cardBg,
              border: `1px solid ${lp.cardBorder}`,
            }}
          >
            <div className="text-center mb-8">
              <h3
                className="text-2xl font-bold mb-2"
                style={{ color: lp.textPrimary }}
              >
                Bantu Evaluasi Kami
              </h3>
              <p style={{ color: lp.textSecondary }}>
                Punya saran atau masalah saat menggunakan HeyJipro? Kirimkan
                feedback Anda di sini.
              </p>
            </div>
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const f = e.currentTarget;
                await executeWithFeedback(
                  async () => {},
                  "Terima kasih atas saran pembangunannya! Segera kami evaluasi.",
                );
                f.reset();
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: lp.labelColor }}
                  >
                    Nama
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Nama Anda"
                    className="w-full px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/50 transition-colors"
                    style={{
                      backgroundColor: lp.inputBg,
                      border: `1px solid ${lp.inputBorder}`,
                      color: lp.textPrimary,
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: lp.labelColor }}
                  >
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="email@contoh.com"
                    className="w-full px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/50 transition-colors"
                    style={{
                      backgroundColor: lp.inputBg,
                      border: `1px solid ${lp.inputBorder}`,
                      color: lp.textPrimary,
                    }}
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: lp.labelColor }}
                >
                  Pesan / Evaluasi
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Saran, kritik, atau bug yang ditemukan..."
                  className="w-full px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/50 transition-colors"
                  style={{
                    backgroundColor: lp.inputBg,
                    border: `1px solid ${lp.inputBorder}`,
                    color: lp.textPrimary,
                  }}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-purple text-white rounded-xl font-medium hover:bg-purple-light transition-colors cursor-pointer"
              >
                Kirim Evaluasi
              </button>
            </form>
          </motion.div>
        </motion.div>
      </section>

      {/* ── 6. Kenapa Berbeda ───────────────────────────────────────────── */}
      <section
        className="py-24 transition-colors duration-300"
        style={{ backgroundColor: lp.sectionWhite }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-6"
        >
          <div
            className="rounded-3xl p-10 lg:p-16 flex flex-col md:flex-row gap-12 items-center transition-colors duration-300"
            style={{
              backgroundColor: lp.cardBg,
              border: `1px solid ${lp.cardBorder}`,
            }}
          >
            <div className="flex-1">
              <h2
                className="text-3xl font-bold mb-8"
                style={{ color: lp.textPrimary }}
              >
                Mengapa Memilih HeyJipro?
              </h2>
              <ul className="space-y-4">
                <CheckItem
                  text="Prioritas otomatis berdasarkan deadline tanpa perlu pusing"
                  lp={lp}
                  delay={0.1}
                />
                <CheckItem
                  text="Fokus paksa pada satu tugas terpenting (Sistem Lock)"
                  lp={lp}
                  delay={0.2}
                />
                <CheckItem
                  text="Manajemen Habit dan Task dalam satu platform terintegrasi"
                  lp={lp}
                  delay={0.3}
                />
                <CheckItem
                  text="Analisis produktivitas pribadi yang mendalam"
                  lp={lp}
                  delay={0.4}
                />
                <CheckItem
                  text="Dirancang secara khusus untuk alur kerja mahasiswa"
                  lp={lp}
                  delay={0.5}
                />
              </ul>
            </div>
            <div className="flex-1 flex justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="w-64 h-64 rounded-full flex items-center justify-center relative shadow-inner"
                style={{ backgroundColor: lp.subCardBg }}
              >
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 20,
                    ease: "linear",
                  }}
                  className="absolute inset-4 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: lp.cardBg,
                    border: `1px solid ${lp.cardBorder}`,
                  }}
                >
                  <Target className="w-20 h-20 text-purple" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── 7. Statistik ────────────────────────────────────────────────── */}
      <section
        className="py-20 transition-colors duration-300"
        style={{
          backgroundColor: lp.sectionGray,
          borderTop: `1px solid ${lp.divider}`,
          borderBottom: `1px solid ${lp.divider}`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <StatBox number="10,000+" label="Task Dikelola" delay={0.1} />
          <StatBox number="95%" label="Target Tercapai" delay={0.2} />
          <StatBox number="30+" label="Hari Konsisten" delay={0.3} />
          <StatBox number="100" label="Productivity Score" delay={0.4} />
        </motion.div>
      </section>

      {/* ── 8. Filosofi Brand — always dark ─────────────────────────────── */}
      <section className="py-32 bg-navy text-center px-6 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto relative z-10"
        >
          <h2 className="text-3xl font-bold text-white mb-10">
            Mengapa HeyJipro?
          </h2>
          <div className="space-y-8 text-lg text-slate-300 leading-relaxed">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <strong className="text-white">"Hey"</strong> adalah sapaan yang
              mengingatkanmu untuk kembali fokus.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <strong className="text-transparent bg-clip-text bg-linear-to-r from-purple to-soft-blue">
                "Jipro"
              </strong>{" "}
              adalah <em>Journey to Productivity</em>, perjalanan menuju versi
              diri yang lebih produktif.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="text-xl font-medium text-white italic pt-6"
              style={{ borderTop: "1px solid #334155" }}
            >
              "Kami percaya bahwa perubahan besar dimulai dari progres kecil
              yang dilakukan secara konsisten."
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ── 8.5 Author + Creator Carousel ───────────────────────────────── */}
      <section
        className="py-24 relative overflow-hidden flex justify-center transition-colors duration-300"
        style={{
          backgroundColor: lp.sectionWhite,
          borderTop: `1px solid ${lp.divider}`,
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-gradient-to-br from-purple/5 to-soft-blue/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[20%] -right-[10%] w-[40%] h-[40%] bg-linear-to-tr from-orange-500/5 to-pink-500/10 rounded-full blur-3xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto px-6 relative z-10 w-full"
        >
          <div
            className="rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-8 md:gap-16 relative overflow-hidden transition-colors duration-300"
            style={{
              background: isDark
                ? "linear-gradient(135deg, #1E293B, #0F172A)"
                : "linear-gradient(135deg, #F8FAFC, #F9FAFB)",
              border: `1px solid ${lp.cardBorder}`,
            }}
          >
            {/* Meet The Creator badge */}
            <div
              className="absolute top-8 left-8 md:top-12 md:left-12 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase flex items-center gap-2 transition-colors duration-300"
              style={{
                backgroundColor: lp.tagBg,
                border: `1px solid ${lp.tagBorder}`,
                color: lp.tagText,
              }}
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Meet The Creator
            </div>

            {/* ── Author Photo Side — floating Instagram 4:5 ── */}
            <div
              className="flex-1 flex flex-col items-center justify-center relative"
              style={{ minHeight: "420px" }}
            >
              {/* Dekorasi lingkaran blur mengambang di belakang */}
              <motion.div
                animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.55, 0.3] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute w-56 h-56 rounded-full blur-3xl pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${creatorSlides[currentSlide].accent}88, transparent 70%)`,
                  top: "10%",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
              <motion.div
                animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
                className="absolute w-32 h-32 rounded-full blur-2xl pointer-events-none"
                style={{
                  background: `radial-gradient(circle, #6366F188, transparent 70%)`,
                  bottom: "5%",
                  right: "10%",
                }}
              />

              {/* Kartu foto mengambang */}
              <motion.div
                key={creatorSlides[currentSlide].id}
                initial={{ opacity: 0, y: 24, scale: 0.93 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -14, 0],
                  rotate: [-1.5, 1.5, -1.5],
                }}
                transition={{
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 },
                  y: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
                  rotate: {
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="relative group z-10"
                style={{ width: "220px", aspectRatio: "4/5" }}
              >
                {/* Glow border beranimasi */}
                <motion.div
                  animate={{ opacity: [0.5, 0.9, 0.5] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -inset-[3px] rounded-[18px] blur-sm"
                  style={{
                    background: `linear-gradient(135deg, ${creatorSlides[currentSlide].accent}, #818CF8, ${creatorSlides[currentSlide].accent})`,
                  }}
                />

                {/* Frame foto */}
                <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                  <img
                    src={creatorSlides[currentSlide].photo}
                    referrerPolicy="no-referrer"
                    alt={creatorSlides[currentSlide].name}
                    className="w-full h-full transition-transform duration-700 group-hover:scale-[1.04]"
                    style={{
                      objectFit: "contain",
                      objectPosition: "center",
                      backgroundColor: "#080810",
                    }}
                  />
                  {/* Shimmer overlay on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)",
                    }}
                  />
                </div>

                {/* Badge "Let's Build!" — kanan atas, mengambang */}
                <motion.div
                  animate={{
                    rotate: [-5, 5, -5],
                    y: [-3, 3, -3],
                    scale: [1, 1.06, 1],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-5 -right-5 px-3 py-1.5 rounded-xl italic font-bold text-xs text-purple z-20 rotate-12 shadow-lg"
                  style={{
                    backgroundColor: lp.tagBg,
                    border: `1px solid ${lp.tagBorder}`,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  "Let's Build! 🚀"
                </motion.div>

                {/* Badge "Powered by Coffee" — kiri bawah, mengambang */}
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [-6, -4, -6] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.8,
                  }}
                  className="absolute -bottom-5 -left-5 bg-navy text-white px-3 py-1.5 rounded-xl shadow-lg font-medium text-[10px] z-20 flex items-center gap-1.5"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ☕
                  </motion.span>
                  Powered by Coffee
                </motion.div>

                {/* Dot dekorasi sudut kiri atas */}
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.4,
                  }}
                  className="absolute -top-2 -left-2 w-3 h-3 rounded-full z-20"
                  style={{
                    backgroundColor: creatorSlides[currentSlide].accent,
                  }}
                />
                {/* Dot dekorasi sudut kanan bawah */}
                <motion.div
                  animate={{ scale: [1.5, 1, 1.5], opacity: [1, 0.5, 1] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.2,
                  }}
                  className="absolute -bottom-2 -right-2 w-2 h-2 rounded-full z-20"
                  style={{ backgroundColor: "#818CF8" }}
                />
              </motion.div>

              {/* Counter slide kecil di bawah foto */}
              <div className="mt-8 flex items-center gap-2 z-10">
                <div
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{
                    backgroundColor: creatorSlides[currentSlide].accent,
                  }}
                />
                <span
                  className="text-[10px] font-semibold tracking-widest uppercase"
                  style={{ color: lp.textMuted }}
                >
                  {currentSlide + 1} / {creatorSlides.length}
                </span>
              </div>
            </div>

            {/* ── Creator Carousel Side ─────────────────────────── */}
            <div className="flex-1 flex flex-col gap-6 z-10 pt-8 md:pt-0 w-full">
              <motion.h3
                key={`name-${creatorSlides[currentSlide].id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="text-4xl md:text-5xl font-black tracking-tight"
                style={{ color: lp.textPrimary }}
              >
                HI I'M{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-purple to-soft-blue">
                  {creatorSlides[currentSlide].name
                    .split(" ")
                    .slice(0, -1)
                    .join(" ")}
                </span>
              </motion.h3>

              {/* Carousel */}
              <div className="relative overflow-hidden">
                <AnimatePresence mode="wait" custom={slideDir}>
                  <motion.div
                    key={currentSlide}
                    custom={slideDir}
                    variants={{
                      enter: (d: number) => ({
                        x: d > 0 ? 60 : -60,
                        opacity: 0,
                      }),
                      center: { x: 0, opacity: 1 },
                      exit: (d: number) => ({
                        x: d > 0 ? -60 : 60,
                        opacity: 0,
                      }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="rounded-2xl p-6 min-h-[160px] flex flex-col justify-between transition-colors duration-300"
                    style={{
                      backgroundColor: lp.slideBg,
                      border: `1px solid ${lp.slideBorder}`,
                    }}
                  >
                    {/* Card top: avatar + name */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                        style={{
                          backgroundColor: creatorSlides[currentSlide].accent,
                        }}
                      >
                        {creatorSlides[currentSlide].emoji}
                      </div>
                      <div>
                        <p
                          className="font-bold text-sm leading-tight"
                          style={{ color: lp.textPrimary }}
                        >
                          {creatorSlides[currentSlide].name}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: creatorSlides[currentSlide].accent }}
                        >
                          {creatorSlides[currentSlide].NIM}
                        </p>
                      </div>
                      <span
                        className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: lp.cardBg,
                          color: lp.textMuted,
                        }}
                      >
                        {currentSlide + 1}/{creatorSlides.length}
                      </span>
                    </div>
                    <p
                      className="text-sm leading-relaxed italic"
                      style={{ color: lp.textSecondary }}
                    >
                      "{creatorSlides[currentSlide].quote}"
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Progress bar */}
                <div
                  className="mt-3 rounded-full h-1 overflow-hidden"
                  style={{ backgroundColor: lp.dotInactive }}
                >
                  <motion.div
                    className="h-full rounded-full bg-linear-to-r from-purple to-soft-blue"
                    animate={{
                      width: `${((currentSlide + 1) / creatorSlides.length) * 100}%`,
                    }}
                    transition={{ duration: 0.35 }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                  style={{
                    backgroundColor: lp.arrowBg,
                    border: `1px solid ${lp.arrowBorder}`,
                    color: lp.textSecondary,
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Dots */}
                <div className="flex gap-1.5 flex-wrap justify-center max-w-[200px]">
                  {creatorSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToSlide(i)}
                      className="rounded-full transition-all cursor-pointer"
                      style={{
                        width: i === currentSlide ? "20px" : "8px",
                        height: "8px",
                        backgroundColor:
                          i === currentSlide
                            ? creatorSlides[currentSlide].accent
                            : lp.dotInactive,
                      }}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                  style={{
                    backgroundColor: lp.arrowBg,
                    border: `1px solid ${lp.arrowBorder}`,
                    color: lp.textSecondary,
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Social buttons — ikut berubah sesuai slide yang aktif */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                <motion.a
                  key={`ig-${creatorSlides[currentSlide].id}`}
                  href={creatorSlides[currentSlide].instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-linear-to-tr hover:from-pink-500 hover:to-orange-400 hover:text-white cursor-pointer"
                  style={{
                    backgroundColor: lp.btnSocial,
                    border: `1px solid ${lp.btnSocialBorder}`,
                    color: lp.btnSocialText,
                  }}
                >
                  <Instagram className="w-5 h-5" /> Instagram
                </motion.a>
                <motion.a
                  key={`li-${creatorSlides[currentSlide].id}`}
                  href={creatorSlides[currentSlide].linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-blue-600 hover:text-white cursor-pointer"
                  style={{
                    backgroundColor: lp.btnSocial,
                    border: `1px solid ${lp.btnSocialBorder}`,
                    color: lp.btnSocialText,
                  }}
                >
                  <Linkedin className="w-5 h-5" /> LinkedIn
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── 9. Final CTA — always gradient ──────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-purple to-soft-blue text-white text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Siap Mengubah Rencana Menjadi Aksi?
          </h2>
          <p className="text-white/80 mb-10 text-xl">
            Berhenti membiarkan waktu terbuang. Saatnya mencapai potensi
            terbaikmu.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAuthModalOpen(true)}
            className="px-10 py-5 bg-white font-bold rounded-full hover:shadow-2xl transition-all shadow-xl text-lg cursor-pointer"
            style={{ color: "#ffffff" }}
          >
            Mulai Perjalanan Produktivitasmu
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};

// ── Typed token helper ────────────────────────────────────────────────────────
type LpTokens = {
  cardBg: string;
  cardBorder: string;
  subCardBg: string;
  textPrimary: string;
  textSecondary: string;
  iconWrap: string;
  [key: string]: string;
};

// ── Helper Components ────────────────────────────────────────────────────────
const ProblemCard = ({
  icon,
  text,
  lp,
  delay = 0,
}: {
  icon: React.ReactNode;
  text: string;
  lp: LpTokens;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 20 }}
    whileInView={{ opacity: 1, scale: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="p-6 rounded-2xl flex items-center gap-4 hover:shadow-lg transition-all cursor-pointer"
    style={{
      backgroundColor: lp.subCardBg,
      border: `1px solid ${lp.cardBorder}`,
    }}
  >
    <div
      className="p-3 rounded-xl flex-shrink-0"
      style={{ backgroundColor: lp.cardBg }}
    >
      {icon}
    </div>
    <p
      className="font-medium text-sm md:text-base leading-tight"
      style={{ color: lp.textPrimary }}
    >
      {text}
    </p>
  </motion.div>
);

const FeatureCard = ({
  icon,
  title,
  desc,
  lp,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  lp: LpTokens;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -10 }}
    className="p-8 rounded-3xl transition-all duration-300 cursor-pointer hover:shadow-xl"
    style={{ backgroundColor: lp.cardBg, border: `1px solid ${lp.cardBorder}` }}
  >
    <div
      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
      style={{ backgroundColor: lp.subCardBg }}
    >
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3" style={{ color: lp.textPrimary }}>
      {title}
    </h3>
    <p className="leading-relaxed" style={{ color: lp.textSecondary }}>
      {desc}
    </p>
  </motion.div>
);

const StepCard = ({
  number,
  icon,
  text,
  delay = 0,
}: {
  number: string;
  icon: React.ReactNode;
  text: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ scale: 1.05 }}
    className="relative text-center p-6 z-10 cursor-pointer"
  >
    <div className="w-20 h-20 mx-auto bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center mb-6 text-purple relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-t from-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      {icon}
    </div>
    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-purple text-white text-sm font-bold rounded-full flex items-center justify-center -mt-6 border-4 border-navy">
      {number}
    </div>
    <p className="text-white font-medium">{text}</p>
  </motion.div>
);

const PreviewCard = ({
  icon,
  title,
  color,
  lp,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  lp: LpTokens;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -8, scale: 1.05 }}
    className={`p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-4 hover:shadow-xl transition-all cursor-pointer`}
    style={{ backgroundColor: lp.cardBg, border: `1px solid ${lp.cardBorder}` }}
  >
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
    >
      {icon}
    </div>
    <h4 className="font-semibold text-sm" style={{ color: lp.textPrimary }}>
      {title}
    </h4>
  </motion.div>
);

const CheckItem = ({
  text,
  lp,
  delay = 0,
}: {
  text: string;
  lp: LpTokens;
  delay?: number;
}) => (
  <motion.li
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="flex items-start gap-3"
  >
    <div className="mt-1 bg-green-100 text-green-600 rounded-full p-1 flex-shrink-0">
      <Check className="w-3 h-3" strokeWidth={3} />
    </div>
    <p className="font-medium opacity-90" style={{ color: lp.textPrimary }}>
      {text}
    </p>
  </motion.li>
);

const StatBox = ({
  number,
  label,
  delay = 0,
}: {
  number: string;
  label: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <h4 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple to-soft-blue mb-2">
      {number}
    </h4>
    <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
      {label}
    </p>
  </motion.div>
);

const TestiCard = ({
  name,
  role,
  feedback,
  lp,
  delay,
}: {
  name: string;
  role: string;
  feedback: string;
  lp: LpTokens;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="p-8 rounded-3xl relative transition-colors duration-300"
    style={{
      backgroundColor: lp.subCardBg,
      border: `1px solid ${lp.cardBorder}`,
    }}
  >
    <div className="absolute top-6 right-8 text-4xl text-purple/20 font-serif">
      "
    </div>
    <p
      className="mb-6 relative z-10 italic"
      style={{ color: lp.textSecondary }}
    >
      "{feedback}"
    </p>
    <div className="flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-full bg-linear-to-tr from-purple/30 to-soft-blue/30 flex items-center justify-center font-bold"
        style={{ color: lp.textPrimary }}
      >
        {name[0]}
      </div>
      <div>
        <h4 className="font-bold" style={{ color: lp.textPrimary }}>
          {name}
        </h4>
        <p className="text-sm" style={{ color: lp.textSecondary }}>
          {role}
        </p>
      </div>
    </div>
  </motion.div>
);
