package com.productivity.backend.habits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
public class CreateHabitRequest {

    private String userId;
    private String habitName;
    @Min(1)
    @Max(31)
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