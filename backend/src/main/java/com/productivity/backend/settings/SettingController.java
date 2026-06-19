package com.productivity.backend.settings;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}) // Ganti dengan URL frontend Anda
public class SettingController {

    @Autowired
    private SettingService settingService;

    @GetMapping("")
    public ResponseEntity<SettingModel> getSetting(@RequestParam String userId, @RequestParam String email) {
        SettingModel setting = settingService.getOrCreateSetting(userId, email);
        return ResponseEntity.ok(setting);
    }

    @PostMapping("/profile")
    public ResponseEntity<SettingModel> updateProfile(@RequestParam String userId, @RequestBody SettingModel dataBaru) {
        SettingModel updated = settingService.updateProfile(userId, dataBaru);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/notifications")
    public ResponseEntity<SettingModel> updateNotifications(@RequestParam String userId, @RequestBody SettingModel dataBaru) {
        SettingModel updated = settingService.updateNotifications(userId, dataBaru);
        return ResponseEntity.ok(updated);
    }
}