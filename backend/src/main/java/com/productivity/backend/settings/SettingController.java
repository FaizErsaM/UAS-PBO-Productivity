package com.productivity.backend.settings;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*")
public class SettingController {

    @Autowired
    private SettingService settingService;

    @GetMapping("/{userId}")
    public ResponseEntity<SettingModel> getSetting(@PathVariable String userId, @RequestParam String email) {
        SettingModel setting = settingService.getOrCreateSetting(userId, email);
        return ResponseEntity.ok(setting);
    }

    @PutMapping("/{userId}/profile")
    public ResponseEntity<SettingModel> updateProfile(@PathVariable String userId, @RequestBody SettingModel dataBaru) {
        SettingModel updated = settingService.updateProfile(userId, dataBaru);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{userId}/notifications")
    public ResponseEntity<SettingModel> updateNotifications(@PathVariable String userId, @RequestBody SettingModel dataBaru) {
        SettingModel updated = settingService.updateNotifications(userId, dataBaru);
        return ResponseEntity.ok(updated);
    }
}