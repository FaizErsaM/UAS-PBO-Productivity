package com.productivity.backend.analytics;

public class AnalyticsModel {

    private int tasksCompleted;
    private int habitsAchieved;
    private int totalFocusMinutes;

    public AnalyticsModel() {
    }

    public AnalyticsModel(int tasksCompleted, int habitsAchieved, int totalFocusMinutes) {
        this.tasksCompleted = tasksCompleted;
        this.habitsAchieved = habitsAchieved;
        this.totalFocusMinutes = totalFocusMinutes;
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
}