package com.productivity.backend.settings;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SettingService {

    @Autowired
    private SettingRepository settingRepository;

    // Fungsi 1: Menyediakan data setting atau membuatnya jika belum ada
    public SettingModel getOrCreateSetting(UUID userId) { // Ubah menjadi UUID
        return settingRepository.findByUserId(userId)
                .orElseGet(() -> {
                    SettingModel newSetting = new SettingModel();
                    newSetting.setUserId(userId);
                    newSetting.setFirstName("User");
                    newSetting.setLastName("");
                    newSetting.setOccupation("");
                    newSetting.setBio("");

                    // Definisikan nilai default boolean jika diperlukan
                    newSetting.setPushEnabled(true);
                    newSetting.setSoundEnabled(true);
                    newSetting.setEmailDigestEnabled(false);
                    newSetting.setEmailFrequency("weekly");

                    return settingRepository.save(newSetting);
                });
    }

    // Fungsi 2: Update profil langsung ke database Supabase
    public SettingModel updateProfile(UUID userId, SettingModel dataBaru) { // Ubah menjadi UUID
        SettingModel existingSetting = settingRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        // Logika update fields dari dataBaru ke existingSetting Anda di sini...
        existingSetting.setFirstName(dataBaru.getFirstName());
        existingSetting.setLastName(dataBaru.getLastName());
        existingSetting.setOccupation(dataBaru.getOccupation());
        existingSetting.setBio(dataBaru.getBio());

        return settingRepository.save(existingSetting);
    }

    // Fungsi 3: Update notifikasi ke database
    public SettingModel updateNotifications(UUID userId, SettingModel dataBaru) {
        SettingModel existingSetting = settingRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        return settingRepository.save(existingSetting);
    }
}