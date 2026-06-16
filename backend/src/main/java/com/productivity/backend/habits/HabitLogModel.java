package com.productivity.backend.habits;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "habit_logs") // Ini tabel baru di Supabase untuk mencatat history check-in
public class HabitLogModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "habit_id", nullable = false)
    private UUID habitId; // Nyambung ke ID dari HabitsModel di atas

    @Column(name = "day_number", nullable = false)
    private int dayNumber; // Mencatat ini check-in hari ke berapa (Day 1, Day 2, ... Day 30)

    @Column(name = "completed_date", nullable = false)
    private LocalDate completedDate; // Mencatat tanggal persisnya tanggal berapa diklik

    // Constructor Kosong
    public HabitLogModel() {}

    // Constructor Utama
    public HabitLogModel(UUID habitId, int dayNumber, LocalDate completedDate) {
        this.habitId = habitId;
        this.dayNumber = dayNumber;
        this.completedDate = completedDate;
    }

    // --- Getter dan Setter ---
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getHabitId() { return habitId; }
    public void setHabitId(UUID habitId) { this.habitId = habitId; }

    public int getDayNumber() { return dayNumber; }
    public void setDayNumber(int dayNumber) { this.dayNumber = dayNumber; }

    public LocalDate getCompletedDate() { return completedDate; }
    public void setCompletedDate(LocalDate completedDate) { this.completedDate = completedDate; }
}
