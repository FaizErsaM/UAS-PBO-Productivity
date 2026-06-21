package com.productivity.backend.settings;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SettingService {

    @Autowired
    private SettingRepository settingRepository;

    // Fungsi 1: Menyediakan data setting atau membuatnya jika belum ada
    public SettingModel getOrCreateSetting(String userId, String email) {
        return settingRepository.findByUserId(userId)
            .orElseGet(() -> {
                SettingModel newSetting = new SettingModel();
                newSetting.setUserId(userId);
                
                if (email != null && email.contains("@")) {
                    newSetting.setFirstName(email.split("@")[0]); 
                } else {
                    newSetting.setFirstName("User");
                }
                newSetting.setLastName("");
                newSetting.setOccupation("");
                newSetting.setBio(""); // Kode rapi, langsung set bio kosong tanpa try-catch

                return settingRepository.save(newSetting);
            });
    }

    // Fungsi 2: Update profil langsung ke database Supabase
    public SettingModel updateProfile(String userId, SettingModel dataBaru) {
        SettingModel existingSetting = settingRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        existingSetting.setFirstName(dataBaru.getFirstName());
        existingSetting.setLastName(dataBaru.getLastName());
        existingSetting.setOccupation(dataBaru.getOccupation());
        existingSetting.setBio(dataBaru.getBio()); // Kode rapi, langsung panggil get dan set secara normal

        return settingRepository.save(existingSetting); 
    }

    // Fungsi 3: Update notifikasi ke database
    public SettingModel updateNotifications(String userId, SettingModel dataBaru) {
        SettingModel existingSetting = settingRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));
            
        return settingRepository.save(existingSetting);
    }
}