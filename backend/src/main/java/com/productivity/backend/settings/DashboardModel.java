package com.productivity.backend.settings; // Pastikan folder 'model' huruf kecil jika di laptopmu kecil

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "settings") // Nama tabel di Supabase tetap 'settings' tidak apa-apa
public class DashboardModel { // HANS: Nama class diubah sesuai nama file!

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", unique = true, nullable = false)
    private String userId;

    // --- Tab Profile ---
    private String firstName;
    private String lastName;
    private String email;
    private String occupation;
    
    @Column(columnDefinition = "TEXT") 
    private String profilePic; 

    // --- Tab Notifications (Fokus Email & Push) ---
    private Boolean pushEnabled;
    private Boolean soundEnabled;
    private Boolean emailDigestEnabled; 
    private String emailFrequency;     

    // --- Sub-tabel Otomatis untuk Grid Informasi Profil ---
    @ElementCollection
    @CollectionTable(name = "setting_grid_items", joinColumns = @JoinColumn(name = "setting_id"))
    private List<GridItem> profileGridItems;

    // Constructor harus diganti namanya sesuai nama Class baru
    public DashboardModel() {} 

    @Embeddable
    public static class GridItem {
        private String id;
        private String label;
        private String value;
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

    // --- Getter & Setter Utama (Nama fungsi get/set harus menyesuaikan variabelnya) ---
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