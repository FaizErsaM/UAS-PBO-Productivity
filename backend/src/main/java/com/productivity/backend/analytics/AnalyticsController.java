package com.productivity.backend.analytics;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:5173")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard/{userId}")
    public ResponseEntity<DashboardAnalyticsResponse> getDashboardData(@PathVariable Long userId) {
        return ResponseEntity.ok(analyticsService.getDashboardAnalytics(userId));
    }

    @PostMapping("/insight")
    public ResponseEntity<ProductivityInsightResponse> generateInsight(@RequestBody AnalyticsModel request) {
        return ResponseEntity.ok(analyticsService.generateInsight(request));
    }
}
