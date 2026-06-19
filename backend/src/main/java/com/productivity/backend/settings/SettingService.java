package com.productivity.backend.settings;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SettingService {

    @Autowired
    private SettingRepository settingRepository;

    public SettingModel getOrCreateSetting(String userId, String userEmail) {
        return settingRepository.findByUserId(userId).orElseGet(() -> {
            SettingModel newSetting = new SettingModel();
            newSetting.setUserId(userId);
            newSetting.setEmail(userEmail);
            newSetting.setPushEnabled(true);
            newSetting.setSoundEnabled(true);
            newSetting.setEmailDigestEnabled(true);
            newSetting.setEmailFrequency("daily");
            return settingRepository.save(newSetting);
        });
    }

    public SettingModel updateProfile(String userId, SettingModel dataBaru) {
        SettingModel setting = settingRepository.findByUserId(userId)
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

    public SettingModel updateNotifications(String userId, SettingModel dataBaru) {
        SettingModel setting = settingRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        setting.setPushEnabled(dataBaru.getPushEnabled());
        setting.setSoundEnabled(dataBaru.getSoundEnabled());
        setting.setEmailDigestEnabled(dataBaru.getEmailDigestEnabled());
        setting.setEmailFrequency(dataBaru.getEmailFrequency());
        return settingRepository.save(setting);
    }
}