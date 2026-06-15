package com.productivity.backend.settings;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/setting")
@CrossOrigin(origins = "*") // Agar frontend React tidak diblokir saat mengakses backend ini
public class DashboardController {

    @Autowired
    private SettingService settingService;

    // GET: Membaca data setting saat halaman pertama kali dibuka
    // Alamat URL: http://localhost:8080/api/setting?userId=KTP_USER&email=email@mhs.com
    @GetMapping
    public ResponseEntity<DashboardModel> getSetting(@RequestParam String userId, @RequestParam String email) {
        return ResponseEntity.ok(settingService.getOrCreateSetting(userId, email));
    }

    // POST: Menyimpan perubahan Tab Profil
    // Alamat URL: http://localhost:8080/api/setting/profile?userId=KTP_USER
    @PostMapping("/profile")
    public ResponseEntity<DashboardModel> updateProfile(@RequestParam String userId, @RequestBody DashboardModel data) {
        return ResponseEntity.ok(settingService.updateProfile(userId, data));
    }

    // POST: Menyimpan perubahan Tab Notifikasi Email
    // Alamat URL: http://localhost:8080/api/setting/notifications?userId=KTP_USER
    @PostMapping("/notifications")
    public ResponseEntity<DashboardModel> updateNotifications(@RequestParam String userId, @RequestBody DashboardModel data) {
        return ResponseEntity.ok(settingService.updateNotifications(userId, data));
    }
}