package com.productivity.backend.habits;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "habits")
public class HabitsModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "habit_name", nullable = false)
    private String habitName;

    @Column(name = "target_period") 
    private int targetPeriod = 30;

    @Column(name = "current_streak") 
    private int currentStreak = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public HabitsModel() {}

    public HabitsModel(UUID userId, String habitName, int targetPeriod) {
        this.userId = userId;
        this.habitName = habitName;
        this.targetPeriod = targetPeriod;
        this.currentStreak = 0;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getHabitName() { return habitName; }
    public void setHabitName(String habitName) { this.habitName = habitName; }

    public int getTargetPeriod() { return targetPeriod; }
    public void setTargetPeriod(int targetPeriod) { this.targetPeriod = targetPeriod; }

    public int getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(int currentStreak) { this.currentStreak = currentStreak; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}