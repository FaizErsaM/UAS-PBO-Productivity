package com.productivity.backend.settings;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "settings")
public class SettingModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", unique = true, nullable = false)
    private String userId;

    // --- Tab Profile (Ditambahkan pemetaan eksplisit ke database) ---
    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email")
    private String email;

    @Column(name = "occupation")
    private String occupation;

    // 1. CUKUP TAMBAHKAN BARIS INI DI SINI
    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio; 
    
    @Column(name = "profile_pic", columnDefinition = "TEXT") 
    private String profilePic; 

    // --- Tab Notifications ---
    @Column(name = "push_enabled")
    private Boolean pushEnabled;

    @Column(name = "sound_enabled")
    private Boolean soundEnabled;

    @Column(name = "email_digest_enabled")
    private Boolean emailDigestEnabled; 

    @Column(name = "email_frequency")
    private String emailFrequency; 

    // --- Sub-tabel Otomatis untuk Grid Informasi Profil ---
    @ElementCollection
    @CollectionTable(name = "setting_grid_items", joinColumns = @JoinColumn(name = "setting_id"))
    private List<GridItem> profileGridItems;

    public SettingModel() {}

    @Embeddable
    public static class GridItem {
        private String id;
        private String label;
        private String value;
        
        @Column(name = "icon_name") 
        private String iconName;

        // Getter & Setter GridItem
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public String getValue() { return value; }
        public void setValue(String value) { this.value = value; }
        public String getIconName() { return iconName; }
        public void setIconName(String iconName) { this.iconName = iconName; }
    }

    // --- Getter & Setter Utama ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }

    // 2. TAMBAHKAN KEDUA FUNGSI GETTER & SETTER BIO INI DI SINI
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getProfilePic() { return profilePic; }
    public void setProfilePic(String profilePic) { this.profilePic = profilePic; }
    public Boolean getPushEnabled() { return pushEnabled; }
    public void setPushEnabled(Boolean pushEnabled) { this.pushEnabled = pushEnabled; }
    public Boolean getSoundEnabled() { return soundEnabled; }
    public void setSoundEnabled(Boolean soundEnabled) { this.soundEnabled = soundEnabled; }
    public Boolean getEmailDigestEnabled() { return emailDigestEnabled; }
    public void setEmailDigestEnabled(Boolean emailDigestEnabled) { this.emailDigestEnabled = emailDigestEnabled; }
    public String getEmailFrequency() { return emailFrequency; }
    public void setEmailFrequency(String emailFrequency) { this.emailFrequency = emailFrequency; }
    public List<GridItem> getProfileGridItems() { return profileGridItems; }
    public void setProfileGridItems(List<GridItem> profileGridItems) { this.profileGridItems = profileGridItems; }
}