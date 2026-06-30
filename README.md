# HeyJipro - Productivity Web App

Aplikasi web produktivitas full-stack yang dibuat sebagai proyek UAS mata kuliah Pemrograman Berorientasi Objek (PBO). Aplikasi ini membantu pengguna mengelola tugas, jadwal, kebiasaan (habits), hingga melihat analitik produktivitas mereka, lengkap dengan fitur autentikasi modern (OTP & Google OAuth) dan asisten chat berbasis AI.

🔗 **Live Demo:** [heyjipro.vercel.app](https://heyjipro.vercel.app)

## Fitur Utama

- **Autentikasi** — Register & login dengan verifikasi OTP via email, lupa password, serta login dengan Google OAuth
- **Manajemen Tugas (Task)** — Buat, kelola, dan pantau tugas harian
- **Jadwal (Schedule)** — Atur agenda dan event dengan reminder
- **Kebiasaan (Habits)** — Lacak kebiasaan harian dengan bantuan AI untuk insight
- **Dashboard & Analytics** — Ringkasan produktivitas dan insight otomatis
- **Notifikasi** — Pengingat deadline tugas terjadwal (scheduler)
- **AI Chat Assistant** — Asisten percakapan berbasis Gemini AI
- **Pengaturan (Settings)** — Kustomisasi profil dan preferensi pengguna

## Tech Stack

**Frontend**

- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Framer Motion / Motion (animasi)
- Recharts (visualisasi data)
- Supabase JS (storage, mis. foto profil)
- Google Generative AI SDK (`@google/genai`)
- Firebase
- React OAuth Google

**Backend**

- Java 17 + Spring Boot
- Spring Security + JWT (jjwt)
- Spring Data JPA + PostgreSQL
- Spring Mail (pengiriman OTP via email)
- Lombok
- Maven

**Deployment**

- Frontend: Vercel
- Backend: Docker

## Struktur Proyek

```
UAS-PBO-Productivity/
├── Frontend/               # Aplikasi React + TypeScript (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── lib/
│   │   └── utils/
│   └── package.json
│
├── backend/                 # REST API Spring Boot
│   └── src/main/java/com/productivity/backend/
│       ├── auth/             # Register, login, OTP, Google login, JWT
│       ├── task/              # Manajemen tugas
│       ├── schedule/          # Manajemen jadwal
│       ├── habits/             # Manajemen kebiasaan + AI insight
│       ├── analytics/        # Insight & ringkasan produktivitas
│       ├── dashboard/        # Data dashboard
│       ├── notification/     # Notifikasi & scheduler deadline
│       ├── chat/              # AI chat assistant
│       ├── settings/          # Pengaturan pengguna
│       ├── user/              # Entitas & repository user
│       └── config/            # Konfigurasi keamanan (Spring Security)
│
└── package.json             # Dependensi tambahan di root (Google OAuth, React Router)
```

## Cara Menjalankan Secara Lokal

### Prasyarat

- Node.js (LTS)
- Java 17
- Maven (atau gunakan Maven Wrapper `mvnw` yang sudah disediakan)
- PostgreSQL

### 1. Clone repository

```bash
git clone https://github.com/FaizErsaM/UAS-PBO-Productivity.git
cd UAS-PBO-Productivity
```

### 2. Menjalankan Backend (Spring Boot)

```bash
cd backend
cp .env.example .env   # lalu isi variabel environment yang dibutuhkan
./mvnw spring-boot:run
```

Pastikan konfigurasi database PostgreSQL pada `src/main/resources/application.properties` sudah sesuai dengan environment lokal kamu.

### 3. Menjalankan Frontend (React + Vite)

```bash
cd Frontend
npm install
cp .env.example .env   # lalu isi variabel environment seperti API URL, Google Client ID, dll.
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173` (default Vite), sementara backend umumnya berjalan di `http://localhost:8081`.

## Environment Variables

Beberapa variabel environment yang umum dibutuhkan (sesuaikan dengan `.env.example` di masing-masing folder):

**Frontend**

- `VITE_BACKEND_API_URL` — URL API backend
- `VITE_GOOGLE_CLIENT_ID` — Client ID untuk Google OAuth
- `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY` — Konfigurasi Supabase Storage

**Backend**

- Konfigurasi koneksi database PostgreSQL
- `JWT_SECRET` — Secret key untuk JWT
- Konfigurasi SMTP untuk pengiriman OTP via email
- Google OAuth Client ID/Secret

## Kontributor

Proyek ini dikembangkan sebagai tugas akhir mata kuliah Pemrograman Berorientasi Objek (PBO) Informatika 2024 UIN SGD Bandung Kelompok 1.

## Lisensi

Belum ditentukan.
