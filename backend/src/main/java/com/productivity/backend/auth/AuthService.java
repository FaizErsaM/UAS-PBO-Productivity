package com.productivity.backend.auth;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;


import com.productivity.backend.settings.SettingModel;
import com.productivity.backend.settings.SettingRepository;
import com.productivity.backend.user.User;
import com.productivity.backend.user.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final SettingRepository settingRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    // Dependency Injection via Constructor
    public AuthService(UserRepository userRepository, SettingRepository settingRepository,
            JwtUtil jwtUtil, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.settingRepository = settingRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    // ─────────────────────────────────────────────
    // GOOGLE LOGIN
    // Perbaikan: sekarang return JWT + user data (konsisten dengan login manual)
    // ─────────────────────────────────────────────
    public ResponseEntity<?> googleLogin(GoogleLoginRequest request) {

        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        User user;

        if (userOptional.isPresent()) {
            user = userOptional.get();
        } else {
            // User baru via Google → simpan dengan authProvider "google"
            user = new User();
            user.setUsername(request.getName());
            user.setEmail(request.getEmail());
            user.setPassword(""); // Google user tidak punya password
            user.setAuthProvider("google");
            user = userRepository.save(user);

            // Buat setting default (sama persis seperti register manual)
            SettingModel setting = new SettingModel();
            setting.setUserId(user.getId());
            setting.setFirstName(request.getName());
            setting.setEmail(user.getEmail());
            setting.setPushEnabled(true);
            setting.setSoundEnabled(true);
            setting.setEmailDigestEnabled(false);
            setting.setEmailFrequency("weekly");
            setting.setProfileGridItems(buildDefaultGridItems());
            settingRepository.save(setting);
        }

        // Generate JWT dan return response yang konsisten
        String token = jwtUtil.generateToken(user.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login Google berhasil");
        response.put("token", token);

        Map<String, String> userData = new HashMap<>();
        userData.put("id", user.getId().toString());
        userData.put("username", user.getUsername());
        userData.put("email", user.getEmail());
        response.put("user", userData);

        return ResponseEntity.ok(response);
    }

    // ─────────────────────────────────────────────
    // REGISTER MANUAL
    // Perbaikan: password di-hash dengan BCrypt, authProvider = "local"
    // Semua logika lain (validasi email, setting default, grid) tidak diubah
    // ─────────────────────────────────────────────
    public ResponseEntity<?> register(RegisterRequest request) {
        // 1. Validasi jika email sudah digunakan
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body("Email sudah digunakan");
        }

        // 2. Simpan data ke tabel 'users'
        User user = new User();
        user.setUsername(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // ✅ hash password
        user.setAuthProvider("local"); // ✅ tandai sebagai akun lokal
        User savedUser = userRepository.save(user);

        System.out.println("USER TERSIMPAN = " + savedUser.getEmail());

        // 3. Simpan data default ke tabel 'settings' terikat dengan UUID user baru
        SettingModel setting = new SettingModel();
        setting.setUserId(savedUser.getId());
        setting.setFirstName(request.getName());
        setting.setEmail(savedUser.getEmail());
        setting.setPushEnabled(true);
        setting.setSoundEnabled(true);
        setting.setEmailDigestEnabled(false);
        setting.setEmailFrequency("weekly");
        setting.setProfileGridItems(buildDefaultGridItems());
        settingRepository.save(setting);

        return ResponseEntity.ok("Register berhasil");
    }

    // ─────────────────────────────────────────────
    // LOGIN MANUAL
    // Perbaikan: cek authProvider agar akun Google tidak bisa login manual,
    // password dibandingkan dengan BCrypt (bukan plain text)
    // Semua logika lain (JWT, response format) tidak diubah
    // ─────────────────────────────────────────────
    public ResponseEntity<?> login(LoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email tidak ditemukan"));
        }

        User user = userOptional.get();

        // ✅ Tolak jika akun ini terdaftar via Google
        if ("google".equals(user.getAuthProvider())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Akun ini terdaftar via Google. Silakan login dengan Google."));
        }

        // ✅ Bandingkan password dengan BCrypt
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password salah"));
        }

        // 1. Buat Token JWT menggunakan email user
        String token = jwtUtil.generateToken(user.getEmail());

        // 2. Bungkus response ke dalam Map/JSON
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login berhasil");
        response.put("token", token);

        // Menyertakan info user penting untuk disimpan di local storage frontend
        Map<String, String> userData = new HashMap<>();
        userData.put("id", user.getId().toString());
        userData.put("username", user.getUsername());
        userData.put("email", user.getEmail());
        response.put("user", userData);

        return ResponseEntity.ok(response);
    }

    public Object getAllUsers() {
        return userRepository.findAll();
    }

    // ─────────────────────────────────────────────
    // HELPER: Default grid items (dipakai oleh register & googleLogin)
    // Dipindah ke method sendiri agar tidak duplikat kode
    // ─────────────────────────────────────────────
    private List<SettingModel.GridItem> buildDefaultGridItems() {
        List<SettingModel.GridItem> defaultGrids = new ArrayList<>();

        SettingModel.GridItem univ = new SettingModel.GridItem();
        univ.setId(UUID.randomUUID().toString());
        univ.setLabel("Universitas");
        univ.setValue("-");
        univ.setIconName("GraduationCap");
        defaultGrids.add(univ);

        SettingModel.GridItem angkatan = new SettingModel.GridItem();
        angkatan.setId(UUID.randomUUID().toString());
        angkatan.setLabel("Angkatan / Tahun");
        angkatan.setValue("-");
        angkatan.setIconName("Calendar");
        defaultGrids.add(angkatan);

        SettingModel.GridItem jurusan = new SettingModel.GridItem();
        jurusan.setId(UUID.randomUUID().toString());
        jurusan.setLabel("Jurusan / Prodi");
        jurusan.setValue("-");
        jurusan.setIconName("Briefcase");
        defaultGrids.add(jurusan);

        SettingModel.GridItem ipk = new SettingModel.GridItem();
        ipk.setId(UUID.randomUUID().toString());
        ipk.setLabel("Target IPK");
        ipk.setValue("-");
        ipk.setIconName("Award");
        defaultGrids.add(ipk);

        return defaultGrids;
    }
}
