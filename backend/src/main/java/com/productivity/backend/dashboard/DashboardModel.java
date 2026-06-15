package com.productivity.backend.dashboard;

public class DashboardModel {

    private int totalTask;
    private int completedTask;
    private int pendingTask;
    private int totalHabit;

    public DashboardModel() {}

    public DashboardModel(int totalTask, int completedTask,
                          int pendingTask, int totalHabit) {
        this.totalTask = totalTask;
        this.completedTask = completedTask;
        this.pendingTask = pendingTask;
        this.totalHabit = totalHabit;
    }

    public int getTotalTask() {
        return totalTask;
    }

    public void setTotalTask(int totalTask) {
        this.totalTask = totalTask;
    }

    public int getCompletedTask() {
        return completedTask;
    }

    public void setCompletedTask(int completedTask) {
        this.completedTask = completedTask;
    }

    public int getPendingTask() {
        return pendingTask;
    }

    public void setPendingTask(int pendingTask) {
        this.pendingTask = pendingTask;
    }

    public int getTotalHabit() {
        return totalHabit;
    }

    public void setTotalHabit(int totalHabit) {
        this.totalHabit = totalHabit;
    }
}