package com.productivity.backend.dashboard;

import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    public DashboardModel getDashboardData() {

        DashboardModel dashboard = new DashboardModel();

        dashboard.setTotalTask(20);
        dashboard.setCompletedTask(15);
        dashboard.setPendingTask(5);
        dashboard.setTotalHabit(8);

        return dashboard;
    }
}