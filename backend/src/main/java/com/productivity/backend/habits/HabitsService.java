package com.productivity.backend.habits;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class HabitsService {

    @Autowired
    private HabitsRepositories habitsRepositories;

    @Autowired
    private HabitLogRepositories habitLogRepositories;

    @Autowired
    private HabitAiProvider habitAiService;

    public List<HabitsModel> getHabitsByUserId(UUID userId) {
        return habitsRepositories.findByUserId(userId);
    }

    public HabitsModel createNewHabit(UUID userId, String habitName, int targetPeriod) {
        HabitsModel newHabit = new HabitsModel(userId, habitName, targetPeriod);
        return habitsRepositories.save(newHabit);
    }

    public HabitLogModel markAsDone(UUID habitId) {
        HabitsModel habit = habitsRepositories.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit tidak ditemukan!"));

        LocalDate today = LocalDate.now();
        boolean alreadyDoneToday = habitLogRepositories.existsByHabitIdAndCompletedDate(habitId, today);
        if (alreadyDoneToday) {
            throw new RuntimeException("Hari ini kamu sudah check-in!");
        }

        List<HabitLogModel> totalLogs = habitLogRepositories.findByHabitId(habitId);
        int nextDayNumber = totalLogs.size() + 1;

        if (nextDayNumber > habit.getTargetPeriod()) {
            throw new RuntimeException("Target sudah selesai!");
        }

        LocalDate yesterday = today.minusDays(1);
        boolean completedYesterday = habitLogRepositories.existsByHabitIdAndCompletedDate(habitId, yesterday);

        habit.setCurrentStreak(completedYesterday || totalLogs.isEmpty() ? habit.getCurrentStreak() + 1 : 1);
        habitsRepositories.save(habit);

        return habitLogRepositories.save(new HabitLogModel(habitId, nextDayNumber, today));
    }

    public String generateHabitWithGemini(String userGoal) {
        return habitAiService.generateHabitSuggestion(userGoal);
    }

    @Transactional
    public void deleteHabit(UUID habitId) {
        HabitsModel habit = habitsRepositories.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit tidak ditemukan!"));
        habitLogRepositories.deleteByHabitId(habitId);
        habitsRepositories.delete(habit);
    }
}