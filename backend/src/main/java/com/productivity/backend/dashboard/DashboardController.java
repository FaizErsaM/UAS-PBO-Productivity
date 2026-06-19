package com.productivity.backend.dashboard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    // GET http://localhost:8080/api/dashboard/{userId}
    @GetMapping("/{userId}")
    public DashboardModel getDashboard(@PathVariable UUID userId) {
        return dashboardService.getDashboardData(userId);
    }
}