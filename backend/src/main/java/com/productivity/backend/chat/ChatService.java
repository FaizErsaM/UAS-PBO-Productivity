package com.productivity.backend.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class ChatService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public String chat(String userMessage) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" + geminiApiKey;

        String systemPrompt = "Kamu adalah Jipro AI, asisten produktivitas untuk mahasiswa. " +
                "Bantu pengguna dengan strategi belajar, manajemen tugas, dan kebiasaan produktif. " +
                "Jawab dalam bahasa yang sama dengan pengguna. Singkat, jelas, dan motivatif.";

        Map<String, Object> requestBody = Map.of(
            "system_instruction", Map.of(
                "parts", List.of(Map.of("text", systemPrompt))
            ),
            "contents", List.of(
                Map.of("parts", List.of(Map.of("text", userMessage)))
            )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            Map body = response.getBody();

            List candidates = (List) body.get("candidates");
            Map candidate = (Map) candidates.get(0);
            Map content = (Map) candidate.get("content");
            List parts = (List) content.get("parts");
            Map part = (Map) parts.get(0);

            return (String) part.get("text");
        } catch (Exception e) {
            e.printStackTrace();
            return "Maaf, Jipro AI sedang tidak dapat merespons. Coba lagi nanti.";
        }
    }
}