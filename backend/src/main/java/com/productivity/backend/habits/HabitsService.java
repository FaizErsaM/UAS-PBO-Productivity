package com.productivity.backend.habits;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpEntity;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class HabitsService {

    @Autowired
    private HabitsRepositories habitsRepositories;

    @Autowired
    private HabitLogRepositories habitLogRepositories;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

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

    @SuppressWarnings("unchecked")
    public String generateHabitWithGemini(String userGoal) {
        // Upgrade ke gemini-3.5-flash yang lebih pintar
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=" + geminiApiKey;

        RestTemplate restTemplate = new RestTemplate();

        // Prompt yang lebih spesifik dan mengikuti bahasa user
        String prompt = "Kamu adalah AI habit coach. Berikan SATU saran habit yang spesifik, terukur, dan realistis berdasarkan tujuan berikut: \"" + userGoal + "\"\n\n" +
                "Aturan:\n" +
                "- Gunakan bahasa yang SAMA dengan bahasa input pengguna (jika Indonesia maka Indonesia, jika Inggris maka Inggris)\n" +
                "- Format: [frekuensi/waktu] + [aktivitas spesifik] + [durasi/jumlah]\n" +
                "- Contoh bagus: 'Membaca buku non-fiksi 30 menit setiap malam sebelum tidur'\n" +
                "- Contoh bagus: 'Exercise at the gym for 45 minutes every morning at 7 AM'\n" +
                "- JANGAN berikan penjelasan, alasan, atau teks tambahan apapun\n" +
                "- JANGAN gunakan bullet point, nomor, atau formatting\n" +
                "- Jawab HANYA dengan nama habitnya saja dalam satu kalimat\n";

        Map<String, Object> requestBody = Map.of(
            "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))
        );
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            Map<String, Object> body = response.getBody();
            
            if (body != null && body.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, String>> parts = (List<Map<String, String>>) content.get("parts");
                return parts.get(0).get("text").trim()
                    .replaceAll("\\*\\*", "")
                    .replaceAll("\\n", " ")
                    .replaceAll("^[-•*]\\s*", "")
                    .trim();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "Membaca buku 30 menit setiap malam sebelum tidur";
    }

    // Menghapus habit beserta semua log check-in nya
    @Transactional
    public void deleteHabit(UUID habitId) {
        HabitsModel habit = habitsRepositories.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit tidak ditemukan!"));
        habitLogRepositories.deleteByHabitId(habitId);
        habitsRepositories.delete(habit);
    }
}