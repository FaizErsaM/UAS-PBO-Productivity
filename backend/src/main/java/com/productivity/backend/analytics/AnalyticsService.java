package com.productivity.backend.analytics;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;

@Service
public class AnalyticsService {

    private final AnalyticsRepository analyticsRepository;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    @Value("${gemini.api-key:}")
    private String apiKey;

    @Value("${gemini.model:gemini-1.5-flash}")
    private String model;

    @Value("${gemini.base-url:https://generativelanguage.googleapis.com/v1beta/models}")
    private String baseUrl;

    public AnalyticsService(AnalyticsRepository analyticsRepository, ObjectMapper objectMapper) {
        this.analyticsRepository = analyticsRepository;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(30))
                .build();
    }

    public ProductivityInsightResponse generateInsight(AnalyticsModel activitySummary) {
        validateConfiguration();

        String prompt = buildPrompt(activitySummary);
        GeminiGenerateContentRequest requestBody = new GeminiGenerateContentRequest(
                List.of(new Content("user", List.of(new Part(prompt)))),
                new SystemInstruction(List.of(new Part(buildSystemInstruction()))),
                new GenerationConfig(0.2, 512, "application/json")
        );

        try {
            String requestJson = objectMapper.writeValueAsString(requestBody);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(buildEndpointUrl()))
                    .timeout(Duration.ofSeconds(30))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestJson, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new IllegalStateException("Gemini API returned status " + response.statusCode() + ": " + response.body());
            }

            GeminiGenerateContentResponse geminiResponse = objectMapper.readValue(response.body(), GeminiGenerateContentResponse.class);
            String rawText = extractResponseText(geminiResponse);
            String jsonText = extractJsonPayload(rawText);

            ProductivityInsightResponse insight = objectMapper.readValue(jsonText, ProductivityInsightResponse.class);
            saveInsight(activitySummary, insight);
            return insight;
        } catch (IOException e) {
            throw new IllegalStateException("Failed to process Gemini response", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Gemini request was interrupted", e);
        }
    }

    private void saveInsight(AnalyticsModel activitySummary, ProductivityInsightResponse insight) {
        AnalyticsInsightEntity entity = new AnalyticsInsightEntity();
        entity.setTasksCompleted(activitySummary.getTasksCompleted());
        entity.setHabitsAchieved(activitySummary.getHabitsAchieved());
        entity.setTotalFocusMinutes(activitySummary.getTotalFocusMinutes());
        entity.setStatusProduktivitas(insight.statusProduktivitas());
        entity.setKesimpulan(insight.kesimpulan());
        entity.setDaftarSaranJson(writeSuggestions(insight.daftarSaran()));
        analyticsRepository.save(entity);
    }

    private String writeSuggestions(List<String> suggestions) {
        return objectMapper.writeValueAsString(suggestions);
    }

    private void validateConfiguration() {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("Gemini API key is missing. Set gemini.api-key or GEMINI_API_KEY.");
        }
    }

    private String buildEndpointUrl() {
        return baseUrl + "/" + model + ":generateContent?key=" + apiKey;
    }

    private String buildSystemInstruction() {
        return "Kamu adalah asisten analytics produktivitas untuk aplikasi Productivity Tracker. "
                + "Analisis data aktivitas user secara singkat, objektif, dan langsung ke inti. "
                + "Selalu kembalikan hanya JSON valid tanpa markdown, tanpa code fence, dan tanpa teks tambahan. "
                + "Skema output wajib: {\"status_produktivitas\":\"baik|kurang\",\"kesimpulan\":\"...\",\"daftar_saran\":[\"...\",\"...\",\"...\"]}.";
    }

    private String buildPrompt(AnalyticsModel activitySummary) {
        return "Data aktivitas user:\n"
                + "- Tugas selesai: " + activitySummary.getTasksCompleted() + "\n"
                + "- Habits tercapai: " + activitySummary.getHabitsAchieved() + "\n"
                + "- Total waktu fokus (menit): " + activitySummary.getTotalFocusMinutes() + "\n\n"
                + "Analisis data tersebut dan berikan respons JSON dengan aturan berikut:\n"
                + "1. status_produktivitas hanya boleh 'baik' atau 'kurang'.\n"
                + "2. kesimpulan berisi ringkasan singkat dalam Bahasa Indonesia.\n"
                + "3. daftar_saran harus berisi tepat 3 saran yang konkret dan dapat dilakukan.\n"
                + "4. Jangan menambahkan field lain selain yang diminta.\n"
                + "5. Output harus JSON valid dan tidak boleh dibungkus markdown.";
    }

    private String extractResponseText(GeminiGenerateContentResponse response) {
        if (response == null || response.candidates == null || response.candidates.isEmpty()) {
            throw new IllegalStateException("Gemini response did not contain any candidates");
        }

        Candidate candidate = response.candidates.get(0);
        if (candidate.content == null || candidate.content.parts == null || candidate.content.parts.isEmpty()) {
            throw new IllegalStateException("Gemini response did not contain content text");
        }

        return candidate.content.parts.get(0).text;
    }

    private String extractJsonPayload(String rawText) {
        if (rawText == null) {
            throw new IllegalStateException("Gemini response text was empty");
        }

        String trimmed = rawText.trim();
        int start = trimmed.indexOf('{');
        int end = trimmed.lastIndexOf('}');

        if (start >= 0 && end > start) {
            return trimmed.substring(start, end + 1);
        }

        return trimmed;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record GeminiGenerateContentRequest(
            List<Content> contents,
            SystemInstruction systemInstruction,
            GenerationConfig generationConfig
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record Content(
            String role,
            List<Part> parts
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record Part(
            String text
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record SystemInstruction(
            List<Part> parts
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record GenerationConfig(
            Double temperature,
            Integer maxOutputTokens,
            String responseMimeType
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record GeminiGenerateContentResponse(
            List<Candidate> candidates
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record Candidate(
            ContentResponse content
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record ContentResponse(
            List<PartResponse> parts
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record PartResponse(
            @JsonProperty("text") String text
    ) {
    }
}