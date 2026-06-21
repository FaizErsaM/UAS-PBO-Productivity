package com.productivity.backend.settings;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.productivity.backend.user.User;
import com.productivity.backend.user.UserRepository;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "http://localhost:5173")
public class SettingController {

    @Autowired
    private SettingService settingService;

    @Autowired
    private UserRepository userRepository;

    // 1. Mengambil data setting (Parameter email dibuat opsional/tidak wajib agar
    // tidak memicu eror)
    @GetMapping("")
    public ResponseEntity<SettingModel> getSetting(@RequestParam String userId,
            @RequestParam(required = false) String email) {
        SettingModel setting = settingService.getOrCreateSetting(userId, email);
        return ResponseEntity.ok(setting);
    }

    // 2. Mengubah password dengan memanfaatkan data email dari tabel settings
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestParam String userId, @RequestBody Map<String, String> request) {
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        // Ambil data settings berdasarkan userId untuk mendapatkan email yang tersimpan
        SettingModel setting = settingService.getOrCreateSetting(userId, null);
        String emailUser = setting.getEmail();

        if (emailUser == null || emailUser.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email user belum terdaftar di pengaturan profil"));
        }

        // Cari data login user berdasarkan email tersebut
        Optional<User> userOptional = userRepository.findByEmail(emailUser);

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "User tidak ditemukan di sistem login"));
        }

        User user = userOptional.get();

        // Validasi password lama
        if (!user.getPassword().equals(currentPassword)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password lama salah!"));
        }

        // Simpan password baru ke database Supabase secara permanen
        user.setPassword(newPassword);
        userRepository.save(user);

        return ResponseEntity.ok().body(Map.of("message", "Password berhasil diubah"));
    }

    @PostMapping("/profile")
    public ResponseEntity<SettingModel> updateProfile(@RequestParam String userId, @RequestBody SettingModel dataBaru) {
        SettingModel updated = settingService.updateProfile(userId, dataBaru);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/notifications")
    public ResponseEntity<SettingModel> updateNotifications(@RequestParam String userId,
            @RequestBody SettingModel dataBaru) {
        SettingModel updated = settingService.updateNotifications(userId, dataBaru);
        return ResponseEntity.ok(updated);
    }
}