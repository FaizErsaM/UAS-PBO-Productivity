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

import java.time.LocalDateTime;
import jakarta.transaction.Transactional;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final SettingRepository settingRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;
    
    private final EmailService emailService;
    private final OtpService otpService;
    private final PasswordResetOtpRepository otpRepository;

    private final WhatsAppService whatsAppService;

    // Dependency Injection via Constructor
    public AuthService(
        UserRepository userRepository,
        SettingRepository settingRepository,
        JwtUtil jwtUtil,
        BCryptPasswordEncoder passwordEncoder,
        EmailService emailService,
        OtpService otpService,
        PasswordResetOtpRepository otpRepository,
        WhatsAppService whatsAppService
    ) {

    this.userRepository = userRepository;
    this.settingRepository = settingRepository;
    this.jwtUtil = jwtUtil;
    this.passwordEncoder = passwordEncoder;

    this.emailService = emailService;
    this.otpService = otpService;
    this.otpRepository = otpRepository;

    this.whatsAppService = whatsAppService;
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

    return ResponseEntity.badRequest()
            .body(Map.of(
                    "message",
                    "Akun Google belum terdaftar. Silakan daftar terlebih dahulu."
            ));
    }

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

public ResponseEntity<?> googleRegister(GoogleLoginRequest request) {

    Optional<User> existingUser = userRepository.findByEmail(request.getEmail());

    if (existingUser.isPresent()) {
        return ResponseEntity.badRequest()
                .body(Map.of("message", "Email sudah terdaftar. Silakan login."));
    }

    User user = new User();
    user.setUsername(request.getName());
    user.setEmail(request.getEmail());
    user.setPassword("");
    user.setAuthProvider("google");

    user = userRepository.save(user);

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

    String token = jwtUtil.generateToken(user.getEmail());

    Map<String, Object> response = new HashMap<>();

    response.put("message", "Register Google berhasil");
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
        user.setAuthProvider("local");                                    // ✅ tandai sebagai akun lokal
        user.setPhoneNumber(request.getPhoneNumber());

        String otp = otpService.generateOtp();

        user.setOtp(otp);
        user.setOtpExpired(LocalDateTime.now().plusMinutes(5));
        user.setVerified(false);
        User savedUser = userRepository.save(user);

        // Kirim OTP via WhatsApp
        whatsAppService.sendOtp(request.getPhoneNumber(), otp);

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

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Register berhasil");

        return ResponseEntity.ok(response);
    }

    // ─────────────────────────────────────────────
    // LOGIN MANUAL
    // Perbaikan: cek authProvider agar akun Google tidak bisa login manual,
    //            password dibandingkan dengan BCrypt (bukan plain text)
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

    public ResponseEntity<?> forgotPassword(ForgotPasswordRequest request) {

    try {

        Optional<User> userOptional =
                userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message","Email tidak ditemukan"));
        }

        otpRepository.deleteByEmail(request.getEmail());

        String otp = otpService.generateOtp();

        PasswordResetOtp resetOtp = new PasswordResetOtp();

        resetOtp.setEmail(request.getEmail());
        resetOtp.setOtp(otp);
        resetOtp.setVerified(false);
        resetOtp.setExpiredAt(LocalDateTime.now().plusMinutes(5));

        otpRepository.save(resetOtp);

        emailService.sendOtp(request.getEmail(), otp);

        return ResponseEntity.ok(
                Map.of("message","OTP berhasil dikirim"));

    } catch (Exception e) {

        e.printStackTrace();

        return ResponseEntity.internalServerError()
                .body(Map.of(
                        "message", e.getMessage()
                ));
    }

}

public ResponseEntity<?> verifyOtp(VerifyOtpRequest request) {

    Optional<PasswordResetOtp> otpOptional =
            otpRepository.findTopByEmailOrderByCreatedAtDesc(request.getEmail());

    if (otpOptional.isEmpty()) {
        return ResponseEntity.badRequest()
                .body(Map.of("message", "OTP tidak ditemukan"));
    }

    PasswordResetOtp resetOtp = otpOptional.get();

    if (!resetOtp.getOtp().equals(request.getOtp())) {
        return ResponseEntity.badRequest()
                .body(Map.of("message", "OTP salah"));
    }

    if (resetOtp.getExpiredAt().isBefore(LocalDateTime.now())) {
        return ResponseEntity.badRequest()
                .body(Map.of("message", "OTP sudah kadaluarsa"));
    }

    resetOtp.setVerified(true);

    otpRepository.save(resetOtp);

    return ResponseEntity.ok(
            Map.of("message", "OTP valid")
    );
}

public ResponseEntity<?> resetPassword(ResetPasswordRequest request) {

    Optional<User> userOptional =
            userRepository.findByEmail(request.getEmail());

    if (userOptional.isEmpty()) {
        return ResponseEntity.badRequest()
                .body(Map.of("message", "User tidak ditemukan"));
    }

    Optional<PasswordResetOtp> otpOptional =
            otpRepository.findTopByEmailOrderByCreatedAtDesc(request.getEmail());

    if (otpOptional.isEmpty()) {
        return ResponseEntity.badRequest()
                .body(Map.of("message", "OTP tidak ditemukan"));
    }

    PasswordResetOtp resetOtp = otpOptional.get();

    if (!resetOtp.getOtp().equals(request.getOtp())) {
        return ResponseEntity.badRequest()
                .body(Map.of("message", "OTP salah"));
    }

    if (!Boolean.TRUE.equals(resetOtp.getVerified())) {
        return ResponseEntity.badRequest()
                .body(Map.of("message", "OTP belum diverifikasi"));
    }

    User user = userOptional.get();

    user.setPassword(passwordEncoder.encode(request.getPassword()));

    userRepository.save(user);

    otpRepository.deleteByEmail(request.getEmail());

    return ResponseEntity.ok(
            Map.of("message", "Password berhasil diubah")
    );
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