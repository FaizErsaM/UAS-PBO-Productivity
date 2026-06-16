package com.productivity.backend.analytics;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data               // Otomatis membuatkan semua Getter, Setter, dan toString()
@NoArgsConstructor  // Otomatis membuatkan Konstruktor Kosong
@AllArgsConstructor // Otomatis membuatkan Konstruktor Lengkap
public class AnalyticsModel {
    private int tasksCompleted;
    private int habitsAchieved;
    private int totalFocusMinutes;
}