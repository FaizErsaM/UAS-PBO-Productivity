package com.productivity.backend.dashboard;

import com.productivity.backend.habits.HabitsRepositories;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class DashboardService {

    @Autowired
    private DashboardRepositories dashboardRepository; // query ke tabel "tasks" di Supabase

    @Autowired
    private HabitsRepositories habitsRepository; // query ke tabel "habits" di Supabase

    public DashboardModel getDashboardData(UUID userId) {

        int totalTask = dashboardRepository.countByUserId(userId);
        int completedTask = dashboardRepository.countByUserIdAndCompleted(userId, true);
        int pendingTask = totalTask - completedTask;
        int totalHabit = habitsRepository.findByUserId(userId).size();

        return new DashboardModel(userId, totalTask, completedTask, pendingTask, totalHabit);
    }
}