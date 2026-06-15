package com.productivity.backend.settings;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SettingService {

    @Autowired
    private DashboardRepository settingRepository;

    // Ambil data, jika belum ada (user baru), otomatis buatkan data default baru
    public DashboardModel getOrCreateSetting(String userId, String userEmail) {
        return settingRepository.findByUserId(userId).orElseGet(() -> {
            DashboardModel newSetting = new DashboardModel();
            newSetting.setUserId(userId);
            newSetting.setEmail(userEmail);
            newSetting.setPushEnabled(true);
            newSetting.setSoundEnabled(true);
            newSetting.setEmailDigestEnabled(true); // Default notifikasi email aktif
            newSetting.setEmailFrequency("daily");
            return settingRepository.save(newSetting);
        });
    }

    // Memperbarui informasi Tab Profile
    public DashboardModel updateProfile(String userId, DashboardModel dataBaru) {
        DashboardModel setting = settingRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));
        
        setting.setFirstName(dataBaru.getFirstName());
        setting.setLastName(dataBaru.getLastName());
        setting.setEmail(dataBaru.getEmail());
        setting.setOccupation(dataBaru.getOccupation());
        if (dataBaru.getProfilePic() != null) {
            setting.setProfilePic(dataBaru.getProfilePic());
        }
        return settingRepository.save(setting);
    }

    // Memperbarui informasi Tab Notifikasi Email (Tanpa WhatsApp)
    public DashboardModel updateNotifications(String userId, DashboardModel dataBaru) {
        DashboardModel setting = settingRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        setting.setPushEnabled(dataBaru.getPushEnabled());
        setting.setSoundEnabled(dataBaru.getSoundEnabled());
        setting.setEmailDigestEnabled(dataBaru.getEmailDigestEnabled());
        setting.setEmailFrequency(dataBaru.getEmailFrequency());
        return settingRepository.save(setting);
    }
}