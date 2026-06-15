package com.productivity.backend.analytics;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "analytics_insights")
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getTasksCompleted() {
        return tasksCompleted;
    }

    public void setTasksCompleted(int tasksCompleted) {
        this.tasksCompleted = tasksCompleted;
    }

    public int getHabitsAchieved() {
        return habitsAchieved;
    }

    public void setHabitsAchieved(int habitsAchieved) {
        this.habitsAchieved = habitsAchieved;
    }

    public int getTotalFocusMinutes() {
        return totalFocusMinutes;
    }

    public void setTotalFocusMinutes(int totalFocusMinutes) {
        this.totalFocusMinutes = totalFocusMinutes;
    }

    public String getStatusProduktivitas() {
        return statusProduktivitas;
    }

    public void setStatusProduktivitas(String statusProduktivitas) {
        this.statusProduktivitas = statusProduktivitas;
    }

    public String getKesimpulan() {
        return kesimpulan;
    }

    public void setKesimpulan(String kesimpulan) {
        this.kesimpulan = kesimpulan;
    }

    public String getDaftarSaranJson() {
        return daftarSaranJson;
    }

    public void setDaftarSaranJson(String daftarSaranJson) {
        this.daftarSaranJson = daftarSaranJson;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}