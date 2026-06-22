package com.productivity.backend.settings;

import java.util.ArrayList;
import java.util.UUID;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Import ini untuk mengamankan Lazy Loading

@Service
public class SettingService {

    @Autowired
    private SettingRepository settingRepository;

    // Fungsi 1: Menyediakan data setting atau membuatnya jika belum ada
    // Fungsi 1: Menyediakan data setting atau membuatnya jika belum ada
    @Transactional(readOnly = true)
    public SettingModel getOrCreateSetting(UUID userId) {
        return settingRepository.findByUserId(userId)
                .orElseGet(() -> {
                    SettingModel newSetting = new SettingModel();
                    newSetting.setUserId(userId);
                    newSetting.setFirstName("User");
                    newSetting.setLastName("");
                    newSetting.setOccupation("");
                    newSetting.setBio("");

                    // Definisikan nilai default boolean
                    newSetting.setPushEnabled(true);
                    newSetting.setSoundEnabled(true);
                    newSetting.setEmailDigestEnabled(false);
                    newSetting.setEmailFrequency("weekly");

                    return settingRepository.save(newSetting);
                });
    }

    // Fungsi 2: Update profil langsung ke database Supabase beserta item grid
    @Transactional
    public SettingModel updateProfile(UUID userId, SettingModel dataBaru) {
        SettingModel existingSetting = settingRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        existingSetting.setFirstName(dataBaru.getFirstName());
        existingSetting.setLastName(dataBaru.getLastName());
        existingSetting.setOccupation(dataBaru.getOccupation());
        existingSetting.setBio(dataBaru.getBio());

        // LOGIKA BARU: Pastikan data list grid ikut diperbarui saat update profile
        // global
        if (dataBaru.getProfileGridItems() != null) {
            existingSetting.setProfileGridItems(dataBaru.getProfileGridItems());
        }

        return settingRepository.save(existingSetting);
    }

    // Fungsi 3: Update notifikasi ke database
    @Transactional
    public SettingModel updateNotifications(UUID userId, SettingModel dataBaru) {
        SettingModel existingSetting = settingRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        existingSetting.setPushEnabled(dataBaru.getPushEnabled());
        existingSetting.setSoundEnabled(dataBaru.getSoundEnabled());
        existingSetting.setEmailDigestEnabled(dataBaru.getEmailDigestEnabled());
        existingSetting.setEmailFrequency(dataBaru.getEmailFrequency());

        return settingRepository.save(existingSetting);
    }

    // FUNGSI BARU: Menyediakan method save() mandiri untuk dipanggil oleh
    // saveSettingGrid di Controller
    @Transactional
    public SettingModel save(SettingModel setting) {
        return settingRepository.save(setting);
    }

    // Fungsi Baru: Mengedit item spesifik di dalam grid berdasarkan Id item
    @Transactional
    public SettingModel updateGridItem(UUID userId, String itemId, SettingModel.GridItem dataBaru) {
        SettingModel setting = settingRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Data pengaturan user tidak ditemukan"));

        // 1. Cari item yang id-nya cocok di dalam list
        boolean ditemukan = false;
        for (SettingModel.GridItem item : setting.getProfileGridItems()) {
            if (item.getId().equals(itemId)) {
                item.updateGrid(dataBaru.getLabel(), dataBaru.getValue(), dataBaru.getIconName());
                ditemukan = true;
                break;
            }
        }

        // 2. LOGIKA UPSERT: Jika tidak ditemukan, jangan lempar error, tapi jadikan
        // item baru
        if (!ditemukan) {
            // Pastikan ID diset secara eksplisit sesuai jalur URL agar tidak null
            dataBaru.setId(itemId);
            // Tambahkan langsung ke dalam koleksi grid
            setting.getProfileGridItems().add(dataBaru);
        }

        return settingRepository.save(setting);
    }

    // Fungsi Baru: Menghapus item spesifik dari list grid berdasarkan Id item
    @Transactional
    public SettingModel deleteGridItem(UUID userId, String itemId) {
        SettingModel setting = settingRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Data pengaturan user tidak ditemukan"));

        // Hapus elemen dari list jika id-nya cocok
        setting.getProfileGridItems().removeIf(item -> item.getId().equals(itemId));

        return settingRepository.save(setting);
    }
}