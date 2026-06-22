package com.productivity.backend.habits;

public class CreateHabitRequest {

    private String userId;
    private String habitName;
    private int targetPeriod;

    // Getter
    public String getUserId() { return userId; }
    public String getHabitName() { return habitName; }
    public int getTargetPeriod() { return targetPeriod; }

    // Setter
    public void setUserId(String userId) { this.userId = userId; }
    public void setHabitName(String habitName) { this.habitName = habitName; }
    public void setTargetPeriod(int targetPeriod) { this.targetPeriod = targetPeriod; }
}