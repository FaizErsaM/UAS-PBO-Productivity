package com.productivity.backend.habits;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;

@Service
public class HabitAiService implements HabitAiProvider {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @SuppressWarnings("unchecked")
    public String generateHabitSuggestion(String userGoal) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;

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
}