package com.productivity.backend.habits;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/habits")
@CrossOrigin(origins = "http://localhost:5173")
public class HabitsController {

    @Autowired
    private HabitsService habitsService;

    // 1. Endpoint untuk menampilkan kartu-kartu habit di halaman utama
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<HabitsModel>> getHabitsByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(habitsService.getHabitsByUserId(userId));
    }

    // 2. Endpoint untuk tab "Manual Entry" - menggunakan DTO CreateHabitRequest (SRP)
    @PostMapping("/manual")
    public ResponseEntity<HabitsModel> createManualHabit(@RequestBody CreateHabitRequest request) {
        UUID userId = UUID.fromString(request.getUserId());
        String habitName = request.getHabitName();
        int targetPeriod = request.getTargetPeriod();
        return ResponseEntity.ok(habitsService.createNewHabit(userId, habitName, targetPeriod));
    }

    // Endpoint kompatibel dengan AppContext.tsx buatan Adit (POST /api/habits)
    @PostMapping
    public ResponseEntity<HabitsModel> createHabit(@RequestBody CreateHabitRequest request) {
        UUID userId = UUID.fromString(request.getUserId());
        String habitName = request.getHabitName();
        int targetPeriod = request.getTargetPeriod();
        return ResponseEntity.ok(habitsService.createNewHabit(userId, habitName, targetPeriod));
    }

    // 3. Endpoint untuk tombol "+ Mark as Done Today" (Sistem Pengunci Hari)
    @PostMapping("/{habitId}/done")
    public ResponseEntity<?> markHabitAsDone(@PathVariable UUID habitId) {
        try {
            HabitLogModel log = habitsService.markAsDone(habitId);
            return ResponseEntity.ok(log);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // 4. Endpoint untuk tab "AI Assistant" (Nembak saran dari Gemini API)
    @PostMapping("/ai-suggest")
    public ResponseEntity<Map<String, String>> getAiSuggestion(@RequestBody Map<String, String> request) {
        String userGoal = request.get("userGoal");
        String suggestion = habitsService.generateHabitWithGemini(userGoal);
        return ResponseEntity.ok(Map.of("suggestedHabit", suggestion));
    }

    // 5. Endpoint untuk menghapus habit
    @DeleteMapping("/{habitId}")
    public ResponseEntity<?> deleteHabit(@PathVariable UUID habitId) {
        try {
            habitsService.deleteHabit(habitId);
            return ResponseEntity.ok(Map.of("message", "Habit berhasil dihapus!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}