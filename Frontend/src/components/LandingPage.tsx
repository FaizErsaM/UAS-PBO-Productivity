import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Target, Lock, Flame, ArrowRight, Frown, Clock, HelpCircle, 
  Activity, CheckSquare, BarChart3, PlusCircle, ListOrdered, 
  Focus, TrendingUp, Check, LayoutDashboard, Instagram, Linkedin, Twitter 
} from 'lucide-react';
import { Logo } from './Logo';
import { AuthModal } from './AuthModal';
import { PaperConfetti } from './PaperConfetti';
import emptyAnimeStudyRoom from '../assets/images/empty_anime_study_room_1780219699619.png';
import authorFaizerPng from '../assets/images/author_faizer_1780236861813.png';
import authorFaizerTwibbon from '../assets/images/author_faizer_twibbon_1780237197243.png';
import authorFaizerImg from '../assets/images/author_faizer_instagram_1780237554321.jpg';
import { useAppContext } from '../context/AppContext';

export const LandingPage = ({ onLogin }: { onLogin: () => void }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authorStyle, setAuthorStyle] = useState<'png' | 'twibbon' | 'instagram'>('png');
  const { executeWithFeedback } = useAppContext();

  const getAuthorImage = () => {
    switch (authorStyle) {
      case 'png': return authorFaizerPng;
      case 'twibbon': return authorFaizerTwibbon;
      case 'instagram': return authorFaizerImg;
      default: return authorFaizerPng;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans selection:bg-purple selection:text-white relative">
      <PaperConfetti />
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLogin={onLogin} 
      />

      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo className="h-10 text-navy" />
          <div className="flex items-center gap-6">
            <a href="#masalah" className="text-sm font-medium text-slate-600 hover:text-navy hidden md:block transition-colors">Masalah</a>
            <a href="#solusi" className="text-sm font-medium text-slate-600 hover:text-navy hidden md:block transition-colors">Solusi</a>
            <a href="#cara-kerja" className="text-sm font-medium text-slate-600 hover:text-navy hidden md:block transition-colors">Cara Kerja</a>
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-purple to-soft-blue text-white text-sm font-bold rounded-full hover:shadow-lg hover:shadow-purple/30 transition-all shadow-sm relative z-10 cursor-pointer"
            >
              Log in
            </button>
          </div>
        </div>
      </nav>

      {/* 1. Hero Section */}
      <section className="pt-32 pb-20 px-6 overflow-hidden relative">
         {/* Study room background overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-15 dark:opacity-20 pointer-events-none mix-blend-multiply dark:mix-blend-screen bg-cover bg-center"
          style={{ backgroundImage: `url(${emptyAnimeStudyRoom})` }}
        ></div>
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-navy leading-[1.1] mb-6 tracking-tight">
                Berhenti Menunda, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple to-soft-blue">Mulai Produktif.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                HeyJipro membantu mahasiswa mengatur tugas, memprioritaskan deadline, dan membangun kebiasaan produktif agar tetap fokus pada hal yang penting.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple to-soft-blue text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple/30 transition-all flex items-center justify-center gap-2"
                >
                  Mulai Gratis <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
          
          {/* Hero Visual Mockup */}
          <div className="flex-1 w-full max-w-2xl relative">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
               transition={{ 
                 opacity: { duration: 0.8, delay: 0.2 },
                 scale: { duration: 0.8, delay: 0.2 },
                 y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
               }}
               className="relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 cursor-pointer"
               whileHover={{ scale: 1.02, rotate: [-1, 1, -1] }}
            >
              {/* Mockup Header */}
              <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs font-semibold text-slate-400">app.heyjipro.com</div>
                <div className="w-10"></div>
              </div>
              
              {/* Mockup Dashboard Content */}
              <div className="p-6">
                <div className="flex gap-4 mb-6">
                   <div className="h-20 w-1/3 bg-purple/10 rounded-xl flex items-center px-4">
                     <div>
                       <div className="text-2xl font-bold text-navy">Priority</div>
                       <div className="text-sm text-slate-500">2 tasks</div>
                     </div>
                   </div>
                   <div className="h-20 w-1/3 bg-soft-blue/10 rounded-xl flex items-center px-4">
                     <div>
                       <div className="text-2xl font-bold text-navy">Habits</div>
                       <div className="text-sm text-slate-500">3 ongoing</div>
                     </div>
                   </div>
                </div>

                <div className="space-y-3">
                   <div className="p-4 bg-white border border-red-200 shadow-sm rounded-xl flex justify-between items-center relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                      <div>
                        <h4 className="font-bold text-navy">Tugas Akhir Bab 1</h4>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Hari ini</div>
                      </div>
                      <span className="px-2 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-lg px-3">High Priority</span>
                   </div>
                   <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center opacity-70">
                      <div>
                        <h4 className="font-medium text-slate-500">Resume Jurnal</h4>
                      </div>
                      <Lock className="w-4 h-4 text-slate-400" />
                   </div>
                </div>
              </div>
            </motion.div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-purple/20 to-soft-blue/20 blur-3xl -z-10 rounded-full" />
          </div>
        </div>
      </section>

      {/* 2. Masalah Section */}
      <section id="masalah" className="py-24 bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy mb-4">Pernah Mengalami Hal Ini?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Sebagai mahasiswa, menyeimbangkan kuliah dan kehidupan bisa sangat melelahkan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProblemCard icon={<Frown className="w-6 h-6 text-red-500" />} text="Tugas menumpuk tanpa arah" delay={0.1} />
            <ProblemCard icon={<Clock className="w-6 h-6 text-orange-500" />} text="Deadline sering terlupakan" delay={0.2} />
            <ProblemCard icon={<HelpCircle className="w-6 h-6 text-yellow-500" />} text="Bingung menentukan prioritas" delay={0.3} />
            <ProblemCard icon={<Activity className="w-6 h-6 text-blue-500" />} text="Produktivitas tidak konsisten" delay={0.4} />
            <ProblemCard icon={<Flame className="w-6 h-6 text-purple" />} text="Sering belajar mepet deadline (SKS)" delay={0.5} />
          </div>
        </motion.div>
      </section>

      {/* 3. Solusi Section */}
      <section id="solusi" className="py-24 bg-[#F9FAFB]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy mb-4">HeyJipro Membantu Kamu Tetap Terorganisir</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard 
              icon={<CheckSquare className="w-6 h-6 text-soft-blue" />}
              title="Smart Task Management"
              desc="Kelola semua tugas dalam satu dashboard. Tidak ada lagi catatan yang tercecer."
              delay={0.1}
            />
            <FeatureCard 
              icon={<Target className="w-6 h-6 text-red-500" />}
              title="Focus Priority System"
              desc="Kerjakan tugas terpenting terlebih dahulu. Sistem kami mengunci tugas sepele sebelum yang utama selesai."
              delay={0.3}
            />
            <FeatureCard 
              icon={<Activity className="w-6 h-6 text-orange-500" />}
              title="Habit Tracker"
              desc="Bangun kebiasaan positif setiap hari. Lacak progresmu dalam 30 hari untuk mencapai konsistensi."
              delay={0.5}
            />
            <FeatureCard 
              icon={<BarChart3 className="w-6 h-6 text-purple" />}
              title="Growth Analytics"
              desc="Lihat perkembangan produktivitasmu. Evaluasi dari waktu ke waktu dan terus jadikan dirimu lebih baik."
              delay={0.7}
            />
          </div>
        </motion.div>
      </section>

      {/* 4. Cara Kerja Section */}
      <section id="cara-kerja" className="py-24 bg-navy text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple/20 blur-[100px] rounded-full"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-6 relative z-10"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Hanya 4 Langkah</h2>
            <p className="text-slate-400 text-lg">Membangun produktivitas tidak pernah semudah ini.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-[1px] bg-slate-700"></div>

            <StepCard number="1" icon={<PlusCircle className="w-8 h-8" />} text="Tambahkan tugas dan deadline" delay={0.1} />
            <StepCard number="2" icon={<ListOrdered className="w-8 h-8" />} text="Sistem mengurutkan prioritas otomatis" delay={0.3} />
            <StepCard number="3" icon={<Focus className="w-8 h-8" />} text="Fokus mengerjakan tugas teratas" delay={0.5} />
            <StepCard number="4" icon={<TrendingUp className="w-8 h-8" />} text="Pantau progres dan konsistensi" delay={0.7} />
          </div>
        </motion.div>
      </section>

      {/* 5. Preview Dashboard Section */}
      <section className="py-24 bg-white hidden md:block">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy mb-4">Intip Dashboard HeyJipro</h2>
          </div>
          
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <PreviewCard icon={<LayoutDashboard />} title="Main Dashboard" color="bg-soft-blue/10 text-soft-blue" delay={0.1} />
              <PreviewCard icon={<CheckSquare />} title="Task Priority Management" color="bg-red-500/10 text-red-500" delay={0.2} />
              <PreviewCard icon={<Activity />} title="Habit Consistency" color="bg-orange-500/10 text-orange-500" delay={0.3} />
              <PreviewCard icon={<BarChart3 />} title="Detailed Analytics" color="bg-purple/10 text-purple" delay={0.4} />
            </div>
            <div className="mt-8 text-center text-slate-500 font-medium">✨ Daftar sekarang untuk melihat langsung! ✨</div>
          </div>
        </motion.div>
      </section>

      {/* 5.5. Feedback / Testimonial Section */}
      <section className="py-24 bg-white border-t border-slate-100 dark:bg-navy-dark dark:border-slate-800">
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="max-w-7xl mx-auto px-6"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy dark:text-white mb-4">Apa Kata Mereka?</h2>
            <p className="text-slate-500 text-lg">Mereka sudah membuktikan bahwa HeyJipro sangat membantu produktivitas.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <TestimonialCard 
              name="Andi S." 
              role="Mahasiswa Teknik" 
              feedback="Fitur Deep Work bener-bener membantu saya buat fokus nugas tanpa kedistract. UI/UX nya juga enak banget diliat."
              delay={0.1}
            />
            <TestimonialCard 
              name="Rara M." 
              role="Content Creator" 
              feedback="Sistem penguncian tasknya jenius! Bikin nggak bisa lari dari tugas prioritas. Habit tracker-nya bantu konsisten banget."
              delay={0.2}
            />
            <TestimonialCard 
              name="Budi P." 
              role="Freelancer" 
              feedback="Awalnya sering nunda kerjaan, setelah pake HeyJipro jadi lebih tertata. Sangat minimalis dan to-the-point!"
              delay={0.3}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-2xl mx-auto bg-slate-50 dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-navy dark:text-white mb-2">Bantu Evaluasi Kami</h3>
              <p className="text-slate-500">Punya saran atau masalah saat menggunakan HeyJipro? Kirimkan feedback Anda di sini.</p>
            </div>
            <form className="space-y-4" onSubmit={async (e) => { 
                e.preventDefault(); 
                const form = e.currentTarget;
                await executeWithFeedback(async () => {
                   // Simulate network processing
                }, 'Terima kasih atas saran pembangunannya! Segera kami evaluasi.');
                form.reset(); 
              }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama</label>
                  <input required type="text" className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple/50" placeholder="Nama Anda" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input required type="email" className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple/50" placeholder="email@contoh.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pesan / Evaluasi</label>
                <textarea required rows={4} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple/50" placeholder="Saran, kritik, atau bug yang ditemukan..." />
              </div>
              <button type="submit" className="w-full py-3 bg-purple text-white rounded-xl font-medium hover:bg-purple-light transition-colors">
                Kirim Evaluasi
              </button>
            </form>
          </motion.div>
        </motion.div>
      </section>

      {/* 6. Kenapa Berbeda? */}
      <section className="py-24 bg-[#F9FAFB]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="bg-white rounded-3xl p-10 lg:p-16 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-navy mb-8">Mengapa Memilih HeyJipro?</h2>
              <ul className="space-y-4">
                <ChecklistItem text="Prioritas otomatis berdasarkan deadline tanpa perlu pusing" delay={0.1} />
                <ChecklistItem text="Fokus paksa pada satu tugas terpenting (Sistem Lock)" delay={0.2} />
                <ChecklistItem text="Manajemen Habit dan Task dalam satu platform terintegrasi" delay={0.3} />
                <ChecklistItem text="Analisis produktivitas pribadi yang mendalam" delay={0.4} />
                <ChecklistItem text="Dirancang secara khusus untuk alur kerja mahasiswa" delay={0.5} />
              </ul>
            </div>
            <div className="flex-1 flex justify-center">
               <motion.div 
                 animate={{ rotate: 360 }} 
                 transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                 className="w-64 h-64 bg-slate-50 rounded-full flex items-center justify-center relative shadow-inner"
               >
                 <motion.div 
                   animate={{ rotate: -360 }} // Reverse rotate so icon stays upright
                   transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                   className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100"
                 >
                    <Target className="w-20 h-20 text-purple" />
                 </motion.div>
               </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 7. Statistik (Optional/Demo) */}
      <section className="py-20 bg-white border-y border-slate-100">
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

      {/* 8. Filosofi Brand */}
      <section className="py-32 bg-navy text-center px-6 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto relative z-10"
        >
          <h2 className="text-3xl font-bold text-white mb-10">Mengapa HeyJipro?</h2>
          <div className="space-y-8 text-lg text-slate-300 leading-relaxed">
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <strong className="text-white">"Hey"</strong> adalah sapaan yang mengingatkanmu untuk kembali fokus.
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
              <strong className="text-transparent bg-clip-text bg-gradient-to-r from-purple to-soft-blue">"Jipro"</strong> adalah <em>Journey to Productivity</em>, perjalanan menuju versi diri yang lebih produktif.
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }} className="text-xl font-medium text-white italic pt-6 border-t border-slate-700">
              "Kami percaya bahwa perubahan besar dimulai dari progres kecil yang dilakukan secara konsisten."
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* 8.5 Author Section */}
      <section className="py-24 bg-white relative overflow-hidden flex justify-center border-t border-slate-100">
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-gradient-to-br from-purple/5 to-soft-blue/10 rounded-full blur-3xl z-0" />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute -bottom-[20%] -right-[10%] w-[40%] h-[40%] bg-gradient-to-tr from-orange-500/5 to-pink-500/10 rounded-full blur-3xl z-0" />
         </div>

         <motion.div 
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="max-w-6xl mx-auto px-6 relative z-10 w-full"
         >
           <div className="bg-gradient-to-br from-slate-50 to-[#F9FAFB] rounded-[3rem] p-8 md:p-16 border border-slate-200 shadow-2xl shadow-purple/5 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
             
             {/* Author Tag */}
             <div className="absolute top-8 left-8 md:top-12 md:left-12 px-4 py-2 bg-white rounded-full text-xs font-bold tracking-widest text-slate-400 uppercase shadow-sm border border-slate-100 flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               Meet The Creator
             </div>

             {/* Author Image - Fun & Aesthetic Sticker */}
              <div className="flex-1 flex flex-col items-center justify-center relative mt-16 md:mt-0">
                <motion.div
                  animate={{ y: [-10, 10, -10], rotate: [-2, 2, -2] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-64 h-64 md:w-80 md:h-80 group mb-6 flex items-center justify-center"
                >
                  <div className={`absolute inset-2 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500 ${
                    authorStyle === 'instagram'
                      ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple/80 opacity-60'
                      : 'bg-gradient-to-tr from-purple/30 to-soft-blue/30'
                  }`} />
                  
                  {/* Gambar dengan filter sticker stroke putih dan drop shadow glow */}
                  <img 
                    src={getAuthorImage()} referrerPolicy="no-referrer" 
                    alt="Faizer" 
                    className={`relative z-10 transition-all duration-500 group-hover:scale-105 ${
                      authorStyle === 'instagram'
                        ? 'w-full h-full object-cover rounded-3xl border-4 border-white shadow-2xl'
                        : 'w-full h-full object-contain'
                    }`}
                    style={{
                      filter: authorStyle === 'instagram'
                        ? 'none'
                        : 'drop-shadow(4px 0px 0px #fff) drop-shadow(-4px 0px 0px #fff) drop-shadow(0px 4px 0px #fff) drop-shadow(0px -4px 0px #fff) drop-shadow(0px 15px 25px rgba(168,85,247,0.3))'
                    }}
                  />
                  
                  <motion.div 
                    animate={{ rotate: [-5, 5, -5], scale: [1, 1.05, 1] }} 
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
                    className="absolute -top-4 -right-4 md:-right-8 bg-white px-5 py-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 italic font-bold text-sm text-purple rotate-12 z-20 cursor-default hover:scale-110 transition-transform"
                  >
                    "Let's Build! 🚀"
                  </motion.div>
                  
                  <motion.div 
                    animate={{ y: [0, -10, 0] }} 
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }} 
                    className="absolute -bottom-2 -left-2 bg-navy text-white px-4 py-2 bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg font-medium text-xs -rotate-6 z-20 flex items-center gap-2 cursor-default"
                  >
                    <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>☕</motion.span>
                    Powered by Coffee
                  </motion.div>
                </motion.div>

                {/* Style Switcher Capsule */}
                <div className="bg-white/95 backdrop-blur-xs border border-slate-200 shadow-md px-2.5 py-1.5 flex gap-1 z-20 scale-90 sm:scale-100 transition-all select-none rounded-2xl mb-4">
                  <button 
                    type="button"
                    onClick={() => setAuthorStyle('png')}
                    className={`px-3 py-1 bg-transparent rounded-xl text-xs font-bold transition-all cursor-pointer ${authorStyle === 'png' ? '!bg-purple text-white shadow-sm shadow-purple/20' : 'text-slate-600 hover:text-navy hover:bg-slate-100'}`}
                  >
                    ✨ Sticker
                  </button>
                  <button 
                    type="button"
                    onClick={() => setAuthorStyle('twibbon')}
                    className={`px-3 py-1 bg-transparent rounded-xl text-xs font-bold transition-all cursor-pointer ${authorStyle === 'twibbon' ? '!bg-purple text-white shadow-sm shadow-purple/20' : 'text-slate-600 hover:text-navy hover:bg-slate-100'}`}
                  >
                    🎓 Twibbon
                  </button>
                  <button 
                    type="button"
                    onClick={() => setAuthorStyle('instagram')}
                    className={`px-3 py-1 bg-transparent rounded-xl text-xs font-bold transition-all cursor-pointer ${authorStyle === 'instagram' ? '!bg-purple text-white shadow-sm shadow-purple/20' : 'text-slate-600 hover:text-navy hover:bg-slate-100'}`}
                  >
                    📷 Instagram
                  </button>
                </div>
              </div>

              {/* Author Info */}
             <div className="flex-1 text-center md:text-left z-10 pt-8 md:pt-0">
               <motion.h3 
                 initial={{ opacity: 0, x: 20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.2 }}
                 className="text-4xl md:text-5xl font-black text-navy mb-4 font-sans tracking-tight"
               >
                 HI I'M <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple to-soft-blue">Faiz Ersa M</span>
               </motion.h3>
               <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-slate-600 mb-8 leading-relaxed space-y-4"
                >
                  <p>
                    Saya membangun <strong className="text-navy font-bold">HeyJipro</strong> karena saya tahu betul rasanya kewalahan menghadapi tugas kuliah, organisasi, dan deadline yang terus menumpuk tanpa sistem yang rapi.
                  </p>
                  <div className="text-sm bg-purple/5 border border-purple/10 p-5 rounded-2xl text-slate-600 shadow-inner space-y-3">
                    <span className="block font-bold text-purple text-xs uppercase tracking-wider">🚀 Kenapa Aku Bikin Platform Ini?</span>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Platform ini dibangun untuk menjadi asisten produktivitas setia yang membantu memecah ambisi besarmu menjadi aksi-aksi harian yang nyata. Melalui fitur to-do list yang interaktif, pelacak kebiasaan (habit tracker), pencatat jurnal harian, dan visualisasi skor produktivitas instan, HeyJipro hadir sebagai ruang tenang di tengah hiruk-pikuk kesibukan akademis dan personalmu.
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      HeyJipro menggabungkan kesederhanaan desain modern dan elemen psikologi positif agar proses mendisiplinkan diri terasa memotivasi, bukan membebani. Let's grow together, stay consistent, and unlock your true potential!
                    </p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap items-center justify-center md:justify-start gap-4"
                >
                  <SocialButton icon={<Instagram className="w-5 h-5"/>} label="Instagram" href="https://www.instagram.com/fmsya_?igsh=M2J0NXMybzYzbGdy&utm_source=qr" hoverColor="hover:bg-gradient-to-tr hover:from-pink-500 hover:to-orange-400 hover:text-white" delay={0.5} />
                 <SocialButton icon={<Linkedin className="w-5 h-5"/>} label="LinkedIn" href="https://www.linkedin.com/in/faiz-ersa-musyafa-6583b3361?utm_source=share_via&utm_content=profile&utm_medium=member_ios" hoverColor="hover:bg-blue-600 hover:text-white hover:border-blue-600" delay={0.6} />
               </motion.div>
             </div>
           </div>
         </motion.div>
      </section>

      {/* 9. Final CTA */}
      <section className="py-24 bg-gradient-to-br from-purple to-soft-blue text-white text-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Siap Mengubah Rencana Menjadi Aksi?</h2>
          <p className="text-white/80 mb-10 text-xl">Berhenti membiarkan waktu terbuang. Saatnya mencapai potensi terbaikmu.</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAuthModalOpen(true)}
            className="px-10 py-5 bg-white text-navy font-bold rounded-full hover:shadow-2xl transition-all shadow-xl text-lg inline-flex flex-col items-center"
          >
            Mulai Perjalanan Produktivitasmu
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};

// Helper Components
const ProblemCard = ({ icon, text, delay = 0 }: { icon: React.ReactNode, text: string, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95, y: 20 }}
    whileInView={{ opacity: 1, scale: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4 hover:shadow-lg hover:border-purple/20 transition-all cursor-pointer"
  >
    <div className="bg-white p-3 rounded-xl shadow-sm">{icon}</div>
    <p className="font-medium text-navy text-sm md:text-base leading-tight">{text}</p>
  </motion.div>
);

const FeatureCard = ({ icon, title, desc, delay = 0 }: { icon: React.ReactNode, title: string, desc: string, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -10 }}
    className="p-8 rounded-3xl bg-white border border-slate-100 hover:border-purple/30 hover:shadow-xl transition-all duration-300 cursor-pointer"
  >
    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-navy mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed">{desc}</p>
  </motion.div>
);

const StepCard = ({ number, icon, text, delay = 0 }: { number: string, icon: React.ReactNode, text: string, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ scale: 1.05 }}
    className="relative text-center p-6 z-10 cursor-pointer"
  >
    <div className="w-20 h-20 mx-auto bg-slate-800 rounded-2xl border border-slate-700 flex flex-col items-center justify-center mb-6 text-purple relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-t from-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      {icon}
    </div>
    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-purple text-white text-sm font-bold rounded-full flex items-center justify-center -mt-6 border-4 border-navy">
      {number}
    </div>
    <p className="text-white font-medium">{text}</p>
  </motion.div>
);

const PreviewCard = ({ icon, title, color, delay = 0 }: { icon: React.ReactNode, title: string, color: string, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -8, scale: 1.05 }}
    className={`p-6 rounded-2xl bg-white border border-slate-100 flex flex-col items-center justify-center text-center gap-4 hover:shadow-xl transition-all cursor-pointer`}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <h4 className="font-semibold text-navy text-sm">{title}</h4>
  </motion.div>
);

const ChecklistItem = ({ text, delay = 0 }: { text: string, delay?: number }) => (
  <motion.li 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="flex items-start gap-3"
  >
    <div className="mt-1 bg-green-100 text-green-600 rounded-full p-1"><Check className="w-3 h-3" strokeWidth={3} /></div>
    <p className="text-navy font-medium opacity-90">{text}</p>
  </motion.li>
);

const StatBox = ({ number, label, delay = 0 }: { number: string, label: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <h4 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple to-soft-blue mb-2">{number}</h4>
    <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{label}</p>
  </motion.div>
);

const TestimonialCard = ({ name, role, feedback, delay }: { name: string, role: string, feedback: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="bg-slate-50 border border-slate-100 p-8 rounded-3xl relative"
  >
    <div className="absolute top-6 right-8 text-4xl text-purple/20 font-serif">"</div>
    <p className="text-slate-600 mb-6 relative z-10 italic">"{feedback}"</p>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple/30 to-soft-blue/30 flex items-center justify-center font-bold text-navy">
        {name[0]}
      </div>
      <div>
        <h4 className="font-bold text-navy">{name}</h4>
        <p className="text-sm text-slate-500">{role}</p>
      </div>
    </div>
  </motion.div>
);

const SocialButton = ({ icon, label, href, hoverColor, delay = 0 }: { icon: React.ReactNode, label: string, href: string, hoverColor: string, delay?: number }) => (
  <motion.a 
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, type: "spring", stiffness: 200 }}
    whileHover={{ scale: 1.05, y: -5 }}
    whileTap={{ scale: 0.95 }}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`flex items-center gap-2 px-5 py-3 bg-white text-slate-600 rounded-xl shadow-sm border border-slate-200 font-semibold transition-all duration-300 ${hoverColor}`}
  >
    {icon}
    <span>{label}</span>
  </motion.a>
);


