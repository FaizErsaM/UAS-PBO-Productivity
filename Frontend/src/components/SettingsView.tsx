/// <reference types="react" />
import React, { useState, useRef } from "react";
import { Card } from "./Card";
import {
  User,
  Mail,
  Shield,
  Bell,
  Moon,
  Sun,
  LogOut,
  Camera,
  Upload,
  Check,
  Lock,
  Key,
  Volume2,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  GraduationCap,
  Award,
  Briefcase,
  Calendar,
  Hash,
  ShieldAlert,
  ShieldCheck,
  Send,
  RefreshCw,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_API_URL || "http://localhost:8081/api"}/settings`;

export const SettingsView = ({ onLogout }: { onLogout?: () => void }) => {
  const {
    user,
    theme,
    setTheme,
    executeWithFeedback,
    profilePic,
    setProfilePic,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    occupation,
    setOccupation,
    saveProfileToDb,
    saveGridToDb,
    getSettingGrid,
    updateGridItemInDb,
    deleteGridItemFromDb,
  } = useAppContext();

  const [activeSection, setActiveSection] = useState<
    "profile" | "notifications" | "privacy"
  >("profile");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 1. DEKLARASI STATE ---
  const [email, setEmail] = useState("student@example.com");

  // Custom Profile Grid States
  // Mendeklarasikan secara eksplisit bahwa array ini berisi objek dengan struktur spesifik
  const [profileGridItems, setProfileGridItems] = useState<
    {
      id: string;
      label: string;
      value: string;
      iconName: string;
    }[]
  >([]);
  const [editingGridId, setEditingGridId] = useState<string | null>(null);
  const [gridLabel, setGridLabel] = useState("");
  const [gridValue, setGridValue] = useState("");
  const [gridIconName, setGridIconName] = useState("GraduationCap");
  const [isAddingGrid, setIsAddingGrid] = useState(false);

  // Notification States
  const [pushEnabled, setPushEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [emailDigestEnabled, setEmailDigestEnabled] = useState(true);
  const [emailFrequency, setEmailFrequency] = useState("weekly");

  // Privacy & Verification States
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [receivedCode, setReceivedCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Fungsi pembantu untuk menyisipkan Token JWT ke Headers
  const getHeaders = () => {
    const token = localStorage.getItem("heyjipro_token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // --- 2. AMBIL DATA DARI BACKEND JAVA ---
  React.useEffect(() => {
    if (user?.id && user?.email) {
      setEmail(user.email);

      fetch(`${API_BASE_URL}/${user.id}`, {
        headers: getHeaders(),
      })
        .then((response) => response.json())
        .then((data) => {
          // 1. Cukup muat preferensi spesifik view settings di sini
          setPushEnabled(data.pushEnabled ?? true);
          setSoundEnabled(data.soundEnabled ?? true);
          setEmailDigestEnabled(data.emailDigestEnabled ?? true);
          setEmailFrequency(data.emailFrequency || "weekly");

          if (data.profileGridItems && data.profileGridItems.length > 0) {
            setProfileGridItems(data.profileGridItems);
          }
        })
        .catch((error) =>
          console.error(
            "Gagal memuat data pengaturan dari Backend Java:",
            error,
          ),
        );
    }
  }, [user]); // Hapus dependensi fungsi set profil dari array pemantau jika tidak diperlukan

  const renderGridIcon = (iconName: string) => {
    switch (iconName) {
      case "GraduationCap":
        return <GraduationCap className="w-4 h-4 text-purple" />;
      case "Award":
        return <Award className="w-4 h-4 text-purple" />;
      case "Briefcase":
        return <Briefcase className="w-4 h-4 text-purple" />;
      case "Calendar":
        return <Calendar className="w-4 h-4 text-purple" />;
      case "Hash":
        return <Hash className="w-4 h-4 text-purple" />;
      default:
        return <User className="w-4 h-4 text-purple" />;
    }
  };

  // 1. HANDLER TAMBAH GRID (Membaca state lokal terbaru lalu push massal)
  const handleAddGridItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gridLabel || !gridValue) {
      executeWithFeedback(async () => {
        throw new Error("Harap isi Label dan Nilai.");
      }, "");
      return;
    }

    const newItem = {
      id: Date.now().toString(), // Generate String ID unik sementara
      label: gridLabel,
      value: gridValue,
      iconName: gridIconName,
    };

    // Buat salinan array baru untuk dikirim ke database
    const updatedGridList = [...profileGridItems, newItem];

    await executeWithFeedback(async () => {
      // Panggil fungsi POST massal dari AppContext
      await saveGridToDb(updatedGridList);
      const freshGridItems = await getSettingGrid();
      // Jika sukses di server, perbarui state lokal agar UI langsung sinkron
      if (freshGridItems && freshGridItems.length > 0) {
        setProfileGridItems(freshGridItems);
      } else {
        setProfileGridItems(updatedGridList);
      }
      setGridLabel("");
      setGridValue("");
      setIsAddingGrid(false);
    }, "Item grid profil baru berhasil ditambahkan!");
  };

  // 2. HANDLER MEMULAI MODE EDIT (Tetap mempertahankan state pengisian form lokal)
  const handleStartEditGrid = (item: {
    id: string;
    label: string;
    value: string;
    iconName: string;
  }) => {
    setEditingGridId(item.id);
    setGridLabel(item.label);
    setGridValue(item.value);
    setGridIconName(item.iconName);
    setIsAddingGrid(false);
  };

  // 3. HANDLER SIMPAN PERUBAHAN EDIT (Menembak rute PUT item spesifik)
  const handleSaveEditGrid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gridLabel || !gridValue || !editingGridId) {
      executeWithFeedback(async () => {
        throw new Error("Harap isi Label dan Nilai.");
      }, "");
      return;
    }

    const updatedDataItem = {
      label: gridLabel,
      value: gridValue,
      iconName: gridIconName,
    };

    await executeWithFeedback(async () => {
      // Panggil fungsi PUT dari AppContext menembak /api/settings/grid/item/{userId}/{itemId}
      await updateGridItemInDb(editingGridId, updatedDataItem);

      // Sinkronisasikan state komponen lokal jika server merespons sukses
      setProfileGridItems((prev) =>
        prev.map((item) =>
          item.id === editingGridId ? { ...item, ...updatedDataItem } : item,
        ),
      );
      setEditingGridId(null);
      setGridLabel("");
      setGridValue("");
    }, "Item grid profil berhasil diperbarui!");
  };

  // 4. HANDLER HAPUS GRID (Menembak rute DELETE item spesifik)
  const handleDeleteGridItem = async (id: string) => {
    await executeWithFeedback(async () => {
      // Panggil fungsi DELETE dari AppContext menembak /api/settings/grid/item/{userId}/{itemId}
      await deleteGridItemFromDb(id);

      // Filter state lokal untuk menghilangkan item yang sudah dihapus secara permanen di database
      setProfileGridItems((prev) => prev.filter((item) => item.id !== id));

      if (editingGridId === id) {
        setEditingGridId(null);
        setGridLabel("");
        setGridValue("");
      }
    }, "Item grid profil berhasil dihapus.");
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      executeWithFeedback(async () => {
        throw new Error("File harus berupa format gambar.");
      }, "");
      return;
    }

    executeWithFeedback(async () => {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setProfilePic(reader.result);
            resolve();
          } else {
            reject(new Error("Gagal memuat gambar."));
          }
        };
        reader.onerror = () => reject(new Error("Error membaca file."));
        reader.readAsDataURL(file);
      });
    }, "Foto profil berhasil diunggah!");
  };

  const handleGoogleImport = () => {
    executeWithFeedback(async () => {
      await new Promise((r) => setTimeout(r, 800));
      setProfilePic(
        "https://api.dicebear.com/7.x/avataaars/svg?seed=GoogleUser&style=circle&backgroundColor=transparent",
      );
    }, "Foto profil berhasil diimpor dari Google akun!");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const currentUserId = user?.id;

    if (!currentUserId) {
      executeWithFeedback(async () => {
        throw new Error(
          "Gagal menyimpan: Sesi login Anda kosong atau kedaluwarsa.",
        );
      }, "");
      return;
    }

    // Gunakan properti camelCase agar dibaca dengan benar oleh Java DTO / Entity
    const profileData = {
      firstName: firstName,
      lastName: "-",
      email: email,
      occupation: occupation,
      profilePic: profilePic,
      profileGridItems: profileGridItems,
    };

    executeWithFeedback(async () => {
      const response = await fetch(`${API_BASE_URL}/profile/${currentUserId}`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan profil ke server backend.");
      }

      await saveProfileToDb(firstName, lastName, profilePic, occupation);
    }, "Informasi pribadi & grid profil berhasil disimpan!");
  };

  const handleSavePreferences = () => {
    const currentUserId = user?.id;

    if (!currentUserId) {
      executeWithFeedback(async () => {
        throw new Error(
          "Gagal menyimpan: Sesi login Anda kosong atau kedaluwarsa.",
        );
      }, "");
      return;
    }

    // Payload disesuaikan ke camelCase SettingModel Java
    const notificationData = {
      pushEnabled: pushEnabled,
      soundEnabled: soundEnabled,
      emailDigestEnabled: emailDigestEnabled,
      emailFrequency: emailFrequency,
    };

    executeWithFeedback(async () => {
      // Menyesuaikan rute endpoint path variable Java: /api/settings/{userId}/notifications
      const response = await fetch(
        `${API_BASE_URL}/notifications/${currentUserId}`,
        {
          method: "POST", // Diubah menjadi POST sesuai Mapping di Java Controller Anda
          headers: getHeaders(),
          body: JSON.stringify(notificationData),
        },
      );

      if (!response.ok) {
        throw new Error("Gagal menyimpan preferensi ke server.");
      }
    }, "Preferensi notifikasi berhasil disimpan!");
  };

  const handleTestBell = () => {
    try {
      const audio = new Audio(
        "https://cdn.freesound.org/previews/411/411088_5121236-lq.mp3",
      );
      audio.volume = 0.5;
      audio
        .play()
        .then(() => {
          executeWithFeedback(
            async () => {},
            "Uji suara bel deadline berhasil dibunyikan!",
          );
        })
        .catch(() => {
          executeWithFeedback(async () => {
            throw new Error(
              "Gagal berinteraksi dengan audio browser. Silakan klik halaman lalu coba lagi.",
            );
          }, "");
        });
    } catch (e) {
      executeWithFeedback(async () => {
        throw new Error("Audio tidak dapat dimuat.");
      }, "");
    }
  };

  const handleSendVerificationCode = () => {
    setIsSendingCode(true);
    setVerificationError("");
    executeWithFeedback(async () => {
      await new Promise((r) => setTimeout(r, 1000));
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setReceivedCode(code);
      setOtpSent(true);
      setIsSendingCode(false);
    }, `Kode verifikasi telah dikirim ke email ${email}!`);
  };

  const handleConfirmVerificationCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode === receivedCode) {
      executeWithFeedback(async () => {
        await new Promise((r) => setTimeout(r, 600));
        setIsEmailVerified(true);
        setOtpSent(false);
        setVerificationCode("");
      }, "Email Anda berhasil diverifikasi secara resmi!");
    } else {
      setVerificationError("Kode OTP yang dimasukkan tidak valid.");
      executeWithFeedback(async () => {
        throw new Error("Kode OTP tidak cocok.");
      }, "");
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      executeWithFeedback(async () => {
        throw new Error("Password saat ini harus diisi.");
      }, "");
      return;
    }
    if (newPassword.length < 6) {
      executeWithFeedback(async () => {
        throw new Error("Password baru minimal harus 6 karakter.");
      }, "");
      return;
    }
    if (newPassword !== confirmPassword) {
      executeWithFeedback(async () => {
        throw new Error(
          "Konfirmasi password tidak cocok dengan password baru.",
        );
      }, "");
      return;
    }

    if (!user?.id) return;

    executeWithFeedback(async () => {
      // Disesuaikan dengan URL PathVariable Java: /api/settings/change-password/{userId}
      const response = await fetch(
        `${API_BASE_URL}/change-password/${user.id}`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            currentPassword: currentPassword,
            newPassword: newPassword,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Gagal memperbarui kata sandi di server.",
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, "Password Anda telah berhasil diperbarui!");
  };

  // --- 3. RETURN JSX INTERFACE ---
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-navy">Settings</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <div className="flex flex-col items-center p-4">
              <div className="relative group w-24 h-24 mb-4">
                <div className="w-full h-full rounded-full bg-linear-to-tr from-purple to-soft-blue p-1 relative">
                  <img
                    src={profilePic}
                    alt="User Avatar"
                    className="w-full h-full rounded-full object-cover bg-slate-50"
                  />
                  <div
                    onClick={handleUploadClick}
                    className="absolute inset-1 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white"
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center mb-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <button
                  onClick={handleUploadClick}
                  className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm font-medium text-slate-600 hover:text-navy hover:bg-slate-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3 h-3" /> Upload Foto
                </button>
                <button
                  onClick={handleGoogleImport}
                  className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm font-medium text-slate-600 hover:text-navy hover:bg-slate-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <img
                    src="https://www.google.com/favicon.ico"
                    className="w-3.5 h-3.5"
                    alt="Google"
                  />{" "}
                  Sync Google
                </button>
              </div>

              <h3 className="text-xl font-bold text-navy">
                {firstName} {lastName}
              </h3>
              <p className="text-slate-500 text-sm">{email}</p>
              <div className="mt-4 px-4 py-1.5 bg-purple/10 text-purple text-xs font-semibold rounded-full">
                Jipro Pro Premium Acc
              </div>

              {/* Dynamic Mini Profile Grid preview */}
              <div className="w-full mt-6 border-t border-slate-100 pt-5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-3">
                  Grid Data Profil
                </p>
                <div className="grid grid-cols-2 gap-2 text-left">
                  {profileGridItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex flex-col justify-between"
                    >
                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                        {renderGridIcon(item.iconName)}
                        {item.label}
                      </span>
                      <span
                        className="text-xs font-semibold text-navy mt-1 truncate"
                        title={item.value}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-6">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveSection("profile")}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 font-semibold rounded-lg text-sm transition-all cursor-pointer ${activeSection === "profile" ? "bg-purple/10 text-purple" : "text-slate-600 hover:bg-slate-50 hover:text-navy"}`}
                >
                  <User className="w-4.5 h-4.5" />
                  Profil Akun
                </button>
                <button
                  onClick={() => setActiveSection("notifications")}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 font-semibold rounded-lg text-sm transition-all cursor-pointer ${activeSection === "notifications" ? "bg-purple/10 text-purple" : "text-slate-600 hover:bg-slate-50 hover:text-navy"}`}
                >
                  <Bell className="w-4.5 h-4.5" />
                  Notifikasi Sistem
                </button>
                <button
                  onClick={() => setActiveSection("privacy")}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 font-semibold rounded-lg text-sm transition-all cursor-pointer ${activeSection === "privacy" ? "bg-purple/10 text-purple" : "text-slate-600 hover:bg-slate-50 hover:text-navy"}`}
                >
                  <Shield className="w-4.5 h-4.5" />
                  Keamanan & Sandi
                </button>
              </nav>
            </div>
          </Card>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-2 space-y-6">
          {activeSection === "profile" && (
            <div className="space-y-6">
              <Card>
                <h3 className="text-lg font-bold text-navy border-b border-slate-100 pb-4 mb-6">
                  Informasi Pribadi
                </h3>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Nama Depan
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/20 focus:border-purple/50 transition-all text-navy text-sm font-medium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Nama Belakang
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/20 focus:border-purple/50 transition-all text-navy text-sm font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Alamat Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/20 focus:border-purple/50 transition-all text-navy text-sm font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Pekerjaan / Jabatan
                    </label>
                    <input
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/20 focus:border-purple/50 transition-all text-navy text-sm font-medium"
                      required
                    />
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-linear-to-r from-purple to-soft-blue text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple/30 transition-all text-sm cursor-pointer"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </Card>

              {/* KUSTOMISASI GRID PROFIL */}
              <Card>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-navy">
                      Kustomisasi Grid Informasi Profil
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Sesuaikan grid informasi di kartu profil sisi kiri Anda.
                    </p>
                  </div>
                  {!isAddingGrid && !editingGridId && (
                    <button
                      onClick={() => {
                        setIsAddingGrid(true);
                        setGridLabel("");
                        setGridValue("");
                        setGridIconName("GraduationCap");
                      }}
                      className="px-3.5 py-2 bg-linear-to-r from-purple to-soft-blue text-white rounded-xl text-xs font-bold hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah Blok
                    </button>
                  )}
                </div>

                {/* Form Tambah / Edit Grid Block */}
                {(isAddingGrid || editingGridId) && (
                  <form
                    onSubmit={
                      isAddingGrid ? handleAddGridItem : handleSaveEditGrid
                    }
                    className="mb-6 p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-navy uppercase tracking-wider">
                        {isAddingGrid
                          ? "Tambah Item Grid Baru"
                          : "Edit Item Grid"}
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingGrid(false);
                          setEditingGridId(null);
                        }}
                        className="text-xs text-slate-500 hover:text-navy underline font-semibold"
                      >
                        Batal
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                          Nama Label
                        </label>
                        <input
                          type="text"
                          value={gridLabel}
                          onChange={(e) => setGridLabel(e.target.value)}
                          placeholder="Contoh: Tahun Masuk"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-navy focus:outline-none focus:ring-1 focus:ring-purple focus:border-purple"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                          Nilai Data
                        </label>
                        <input
                          type="text"
                          value={gridValue}
                          onChange={(e) => setGridValue(e.target.value)}
                          placeholder="Contoh: 2024"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-navy focus:outline-none focus:ring-1 focus:ring-purple focus:border-purple"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                          Pilih Ikon
                        </label>
                        <select
                          value={gridIconName}
                          onChange={(e) => setGridIconName(e.target.value)}
                          className="w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-navy focus:outline-none focus:ring-1 focus:ring-purple focus:border-purple"
                        >
                          <option value="GraduationCap">
                            Akademik (Graduation)
                          </option>
                          <option value="Award">Prestasi (Award)</option>
                          <option value="Briefcase">
                            Pekerjaan/Status (Briefcase)
                          </option>
                          <option value="Calendar">
                            Tahun/Tanggal (Calendar)
                          </option>
                          <option value="Hash">Nomor/ID (Hash)</option>
                          <option value="User">Umum (User)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-purple text-white rounded-lg text-xs font-bold hover:bg-purple/80 transition-all cursor-pointer"
                      >
                        {isAddingGrid ? "Tambahkan" : "Simpan Perubahan"}
                      </button>
                    </div>
                  </form>
                )}

                {/* List of current grid items editable */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileGridItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 border border-slate-100 rounded-xl bg-slate-50/50 flex items-center justify-between group hover:border-slate-200 hover:bg-slate-50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple/10 text-purple rounded-xl shrink-0">
                          {renderGridIcon(item.iconName)}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {item.label}
                          </p>
                          <p className="text-sm font-bold text-navy mt-0.5">
                            {item.value}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleStartEditGrid(item)}
                          className="p-1.5 hover:bg-slate-200 text-slate-500 hover:text-purple rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteGridItem(item.id)}
                          className="p-1.5 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {profileGridItems.length === 0 && (
                    <div className="col-span-2 text-center py-8 text-slate-400 text-xs font-semibold">
                      Belum ada kustom grid ditambahkan. Silakan klik "Tambah
                      Blok" untuk membuat data grid profil Anda sendiri!
                    </div>
                  )}
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-bold text-navy border-b border-slate-100 pb-4 mb-6">
                  Tampilan Aplikasi
                </h3>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-navy flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-500" />
                      Appearance Mode
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Pilih tema utama aplikasi: Mode Terang (Light) atau Mode
                      Gelap (Dark).
                    </p>
                  </div>
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setTheme("light")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${theme === "light" ? "bg-white text-navy shadow-sm" : "text-slate-500 hover:text-navy"}`}
                    >
                      <Sun className="w-3.5 h-3.5" /> Mode Terang
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${theme === "dark" ? "bg-white text-navy shadow-sm" : "text-slate-500 hover:text-navy"}`}
                    >
                      <Moon className="w-3.5 h-3.5" /> Mode Gelap
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="space-y-6">
              <Card>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <h3 className="text-lg font-bold text-navy">
                    Konfigurasi Pengingat & Suara
                  </h3>
                  <button
                    onClick={handleSavePreferences}
                    className="text-xs bg-purple/10 text-purple hover:bg-purple/20 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
                  >
                    Simpan Semua Preferensi
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Bell Reminder sound config */}
                  <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50">
                    <div className="max-w-[70%]">
                      <h4 className="font-semibold text-navy text-sm flex items-center gap-2">
                        <Volume2 className="w-4.5 h-4.5 text-purple" />
                        Nada Dering Bell Peringatan
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Mainkan nada bel emas ketika deadline tugas tersisa
                        dalam waktu kurang dari 1 hari secara real-time.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleTestBell}
                        className="px-3 py-1.5 text-xs bg-white text-purple border border-purple/20 rounded-lg hover:bg-purple/5 font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Volume2 className="w-3.5 h-3.5" /> Uji Suara
                      </button>
                      <div
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`w-11 h-6 rounded-full cursor-pointer relative transition-colors ${soundEnabled ? "bg-purple" : "bg-slate-300"}`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-transform ${soundEnabled ? "right-1" : "left-1"}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Push notification toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-navy text-sm flex items-center gap-2">
                        <Bell className="w-4 h-4 text-purple" />
                        Push Notification Sistem
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Tampilkan banner notifikasi penting di dalam sistem
                        dashboard.
                      </p>
                    </div>
                    <div
                      onClick={() => setPushEnabled(!pushEnabled)}
                      className={`w-11 h-6 rounded-full cursor-pointer relative transition-colors ${pushEnabled ? "bg-purple" : "bg-slate-300"}`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-transform ${pushEnabled ? "right-1" : "left-1"}`}
                      />
                    </div>
                  </div>

                  {/* Email Digest toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-navy text-sm flex items-center gap-2">
                        <Mail className="w-4 h-4 text-purple" />
                        Notifikasi Pengingat Email
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Kirim ringkasan otomatis & pengingat deadline ke email
                        yang terdaftar.
                      </p>
                    </div>
                    <div
                      onClick={() => setEmailDigestEnabled(!emailDigestEnabled)}
                      className={`w-11 h-6 rounded-full cursor-pointer relative transition-colors ${emailDigestEnabled ? "bg-purple" : "bg-slate-300"}`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-transform ${emailDigestEnabled ? "right-1" : "left-1"}`}
                      />
                    </div>
                  </div>

                  {/* Email frequency dropdown */}
                  {emailDigestEnabled && (
                    <div className="p-3 bg-purple/5 border border-purple/10 rounded-xl space-y-2">
                      <label className="block text-xs font-bold text-navy uppercase tracking-wider">
                        Frekuensi Email Pengingat
                      </label>
                      <select
                        value={emailFrequency}
                        onChange={(e) => setEmailFrequency(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-purple focus:border-purple text-navy"
                      >
                        <option value="immediate">
                          Seketika (Saat deadline mendekati 1 hari)
                        </option>
                        <option value="daily">
                          Laporan Harian (Setiap pagi jam 08:00)
                        </option>
                        <option value="weekly">
                          Rangkuman Mingguan (Setiap hari senin)
                        </option>
                      </select>
                    </div>
                  )}
                </div>
              </Card>
              {/* KARTU INTEGRASI WHATSAPP SEBELUMNYA DI SINI SUDAH DIHAPUS TOTAL */}
            </div>
          )}

          {activeSection === "privacy" && (
            <div className="space-y-6">
              {/* Captcha Security Card */}
              <Card>
                <h3 className="text-lg font-bold text-navy border-b border-slate-100 pb-4 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple" />
                  Sistem Autentikasi Pengaman (Robot Check)
                </h3>
                <div className="p-3 border border-emerald-100 bg-emerald-50/50 rounded-xl flex items-start gap-3">
                  <div className="p-1 bg-emerald-100 text-emerald-700 rounded-full shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-900">
                      Perlindungan Captcha Tulis Ulang Aktif
                    </h4>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      Sistem login telah dilindungi dengan Captcha Tulis Ulang
                      Huruf Acak pada form Autentikasi. Ini mencegah serangan
                      brute force dan bot liar ke akun privat Anda.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Email Verification Card */}
              <Card>
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-2">
                  <h3 className="text-lg font-bold text-navy flex items-center gap-2">
                    <Mail className="w-5 h-5 text-purple" />
                    Verifikasi Keamanan Email
                  </h3>
                  {isEmailVerified ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg flex items-center gap-1.5 self-start">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 animate-pulse" />{" "}
                      Terverifikasi
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg flex items-center gap-1.5 self-start">
                      <ShieldAlert className="w-4 h-4 text-amber-600" /> Belum
                      Terverifikasi
                    </span>
                  )}
                </div>

                {isEmailVerified ? (
                  <div className="space-y-4">
                    <div className="p-4 border border-emerald-100 bg-emerald-50/40 rounded-xl flex items-start gap-3">
                      <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-full shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-emerald-950">
                          Email Anda Terverifikasi
                        </h4>
                        <p className="text-xs text-emerald-700 mt-1">
                          Email{" "}
                          <strong className="font-semibold text-emerald-900">
                            {email}
                          </strong>{" "}
                          telah diverifikasi secara sukses. Akun Anda sekarang
                          memiliki kredensial penuh dan didukung proteksi
                          keamanan ganda.
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          setIsEmailVerified(false);
                          setOtpSent(false);
                          setVerificationCode("");
                          executeWithFeedback(
                            async () => {},
                            "Penyambungan email diset ulang.",
                          );
                        }}
                        className="px-4 py-2 border border-slate-200 text-slate-600 hover:text-navy hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Sambungkan Ulang
                        Email
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Lakukan verifikasi email untuk mengonfirmasi bahwa Anda
                      pemilik sah akun{" "}
                      <strong className="text-navy">{email}</strong>. Ini
                      penting demi kelancaran pemulihan kata sandi otomatis dan
                      keamanan database.
                    </p>

                    {otpSent ? (
                      <form
                        onSubmit={handleConfirmVerificationCode}
                        className="space-y-3 p-4 bg-purple/5 border border-purple/10 rounded-xl"
                      >
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-navy uppercase tracking-wider">
                            Masukkan Kode OTP
                          </label>
                          <span className="text-[10px] bg-purple/10 text-purple px-2 py-0.5 rounded-md font-bold">
                            Kode Uji: {receivedCode}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            value={verificationCode}
                            onChange={(e) =>
                              setVerificationCode(e.target.value)
                            }
                            placeholder="Ketik 6 digit angka"
                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-center tracking-widest font-bold text-navy focus:outline-none focus:ring-1 focus:ring-purple focus:border-purple"
                            required
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-purple text-white text-xs font-bold rounded-lg hover:bg-purple/80 transition-all cursor-pointer flex items-center gap-1"
                          >
                            Verifikasi
                          </button>
                        </div>

                        {verificationError && (
                          <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            {verificationError}
                          </p>
                        )}

                        <div className="flex justify-between items-center pt-2 text-[10px] text-slate-400">
                          <span>Tidak menerima kode?</span>
                          <button
                            type="button"
                            onClick={handleSendVerificationCode}
                            className="text-purple hover:underline font-bold"
                          >
                            Kirim Ulang Kode OTP
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                        <div className="flex items-center gap-2.5">
                          <Mail className="w-5 h-5 text-purple shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-slate-700">
                              Kirim kode verifikasi ke:
                            </p>
                            <p className="text-sm font-semibold text-navy mt-0.5">
                              {email}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleSendVerificationCode}
                          disabled={isSendingCode}
                          className="px-4 py-2 bg-linear-to-r from-purple to-soft-blue text-white rounded-xl text-xs font-bold hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
                        >
                          {isSendingCode ? (
                            "Mengirim..."
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" /> Kirim Kode OTP
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </Card>

              {/* Password update Form */}
              <Card>
                <h3 className="text-lg font-bold text-navy border-b border-slate-100 pb-4 mb-6">
                  Ubah Kata Sandi
                </h3>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Kata Sandi Saat Ini
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/20 focus:border-purple/50 transition-all text-navy text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Kata Sandi Baru
                      </label>
                      <div className="relative">
                        <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min 6 karakter"
                          className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/20 focus:border-purple/50 transition-all text-navy text-sm font-medium"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Konfirmasi Sandi Baru
                      </label>
                      <div className="relative">
                        <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Tulis ulang sandi"
                          className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/20 focus:border-purple/50 transition-all text-navy text-sm font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-purple text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple/30 transition-all text-sm cursor-pointer"
                    >
                      Perbarui Sandi
                    </button>
                  </div>
                </form>
              </Card>

              {/* Login Sessions */}
              <Card>
                <h3 className="text-base font-bold text-navy border-b border-slate-100 pb-3 mb-4">
                  Sesi Login Terkini
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                      <div>
                        <p className="font-bold text-slate-800">
                          Browser Aktif Saat Ini
                        </p>
                        <p className="text-slate-500 text-[10px]">
                          Cloud Run Sandbox Ingress • Jakarta, ID
                        </p>
                      </div>
                    </div>
                    <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      Sesi Ini
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Danger Zone */}
          <Card>
            <h3 className="text-lg font-bold text-rose-600 border-b border-rose-100 pb-4 mb-6">
              Danger Zone (Keluar)
            </h3>
            <p className="text-xs text-slate-600 mb-4 font-medium">
              Keluar dari akun akan menghapus sesi login aktif saat ini. Anda
              harus masuk kembali dengan melengkapi Captcha untuk mengakses
              dashboard.
            </p>
            <button
              onClick={onLogout}
              className="px-6 py-2.5 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 transition-colors flex items-center gap-2 text-sm cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Keluar dari Akun (Sign Out)
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};
