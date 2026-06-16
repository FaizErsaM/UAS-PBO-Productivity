package com.productivity.backend.analytics;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record DashboardAnalyticsResponse(
    @JsonProperty("summary") SummaryData summary,
    @JsonProperty("specific_tasks") List<TaskProgress> specificTasks,
    @JsonProperty("habit_goals") List<HabitProgress> habitGoals,
    @JsonProperty("ai_insight") ProductivityInsightResponse aiInsight
) {}

record SummaryData(
    @JsonProperty("tasks_completed") int tasksCompleted,
    @JsonProperty("total_tasks") int totalTasks,
    @JsonProperty("completion_rate") int completionRate,
    @JsonProperty("habit_success_rate") int habitSuccessRate
) {}

record TaskProgress(
    @JsonProperty("task_name") String taskName,
    @JsonProperty("completion_rate") int completionRate
) {}

record HabitProgress(
    @JsonProperty("habit_name") String habitName,
    @JsonProperty("current_days") int currentDays,
    @JsonProperty("target_days") int targetDays,
    @JsonProperty("completion_rate") int completionRate
) {}