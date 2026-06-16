package com.productivity.backend.analytics;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "analytics_insights")
@Getter // Menggantikan semua fungsi get... manual
@Setter // Menggantikan semua fungsi set... manual
@NoArgsConstructor // Menyediakan konstruktor kosong bawaan yang dibutuhkan JPA
public class AnalyticsInsightEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tasks_completed", nullable = false)
    private int tasksCompleted;

    @Column(name = "habits_achieved", nullable = false)
    private int habitsAchieved;

    @Column(name = "total_focus_minutes", nullable = false)
    private int totalFocusMinutes;

    @Column(name = "status_produktivitas", nullable = false, length = 20)
    private String statusProduktivitas;

    @Column(name = "kesimpulan", nullable = false, columnDefinition = "text")
    private String kesimpulan;

    @Column(name = "daftar_saran_json", nullable = false, columnDefinition = "text")
    private String daftarSaranJson;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}