package com.productivity.backend.settings;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import com.productivity.backend.user.User;
import com.productivity.backend.user.UserRepository;

import java.util.List; // 1. WAJIB TAMBAHKAN IMPORT INI AGAR LIST TIDAK ERROR
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "http://localhost:5173")
public class SettingController {

    @Autowired
    private SettingService settingService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<SettingModel> getSetting(@PathVariable("userId") UUID userId) {
        SettingModel setting = settingService.getOrCreateSetting(userId);
        return ResponseEntity.ok(setting);
    }

    @GetMapping("/grid/{userId}")
    public ResponseEntity<List<SettingModel.GridItem>> getSettingGrid(@PathVariable("userId") UUID userId) {
        SettingModel setting = settingService.getOrCreateSetting(userId);
        return ResponseEntity.ok(setting.getProfileGridItems());
    }

    @PostMapping("/grid/{userId}")
    public ResponseEntity<?> saveSettingGrid(
            @PathVariable("userId") UUID userId,
            @RequestBody List<SettingModel.GridItem> newGridItems) {

        SettingModel setting = settingService.getOrCreateSetting(userId);
        setting.setProfileGridItems(newGridItems);

        // Pastikan di SettingService Anda sudah membuat method save()
        settingService.save(setting);

        return ResponseEntity.ok(Map.of("message", "Kustomisasi grid profil berhasil diperbarui"));
    } // 2. DI SINI SEBELUMNYA KURANG KURUNG KURAWAL PENUTUP METHOD

    // Endpoint untuk Mengubah/Edit Item Grid Spesifik
    @PutMapping("/grid/item/{userId}/{itemId}")
    public ResponseEntity<SettingModel> updateGridItem(
            @PathVariable("userId") UUID userId,
            @PathVariable("itemId") String itemId,
            @RequestBody SettingModel.GridItem dataBaru) {

        SettingModel updated = settingService.updateGridItem(userId, itemId, dataBaru);
        return ResponseEntity.ok(updated);
    }

    @PostMapping(value = "/profile-pic/{userId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProfilePic(
            @PathVariable("userId") UUID userId,
            @RequestPart("file") MultipartFile file) {
        try {
            SettingModel updated = settingService.updateProfilePic(userId, file);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // Endpoint untuk Menghapus Item Grid Spesifik
    @DeleteMapping("/grid/item/{userId}/{itemId}")
    public ResponseEntity<SettingModel> deleteGridItem(
            @PathVariable("userId") UUID userId,
            @PathVariable("itemId") String itemId) {

        SettingModel updated = settingService.deleteGridItem(userId, itemId);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/change-password/{userId}")
    public ResponseEntity<?> changePassword(@PathVariable("userId") UUID userId,
            @RequestBody Map<String, String> request) {
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        SettingModel setting = settingService.getOrCreateSetting(userId);
        String emailUser = setting.getEmail();

        if (emailUser == null || emailUser.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email user belum terdaftar di pengaturan profil"));
        }

        Optional<User> userOptional = userRepository.findByEmail(emailUser);

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "User tidak ditemukan di sistem login"));
        }

        User user = userOptional.get();

        if (!user.getPassword().equals(currentPassword)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password lama salah!"));
        }

        user.setPassword(newPassword);
        userRepository.save(user);

        return ResponseEntity.ok().body(Map.of("message", "Password berhasil diubah"));
    }

    @PostMapping("/profile/{userId}")
    public ResponseEntity<SettingModel> updateProfile(@PathVariable("userId") UUID userId,
            @RequestBody SettingModel dataBaru) {
        SettingModel updated = settingService.updateProfile(userId, dataBaru);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/notifications/{userId}")
    public ResponseEntity<SettingModel> updateNotifications(@PathVariable("userId") UUID userId,
            @RequestBody SettingModel dataBaru) {
        SettingModel updated = settingService.updateNotifications(userId, dataBaru);
        return ResponseEntity.ok(updated);
    }
}