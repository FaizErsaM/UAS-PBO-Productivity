package com.productivity.backend.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class WhatsAppService {

    @Value("${fonnte.token}")
    private String token;

    public void sendOtp(String phoneNumber, String otp) {

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("target", phoneNumber);
        body.put("message",
        "🔐 *HeyJipro - Verifikasi Akun*\n\n"
                + "Halo! 👋\n\n"
                + "Kode OTP Anda adalah:\n"
                + "*" + otp + "*\n\n"
                + "⏳ Kode berlaku selama *5 menit*.\n\n"
                + "⚠️ Demi keamanan, jangan bagikan kode ini kepada siapa pun, termasuk admin HeyJipro.\n"
                + "Jika Anda tidak melakukan permintaan ini, abaikan pesan ini.\n\n"
                + "Terima kasih telah menggunakan HeyJipro. 🚀");
        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(body, headers);

        restTemplate.postForEntity(
                "https://api.fonnte.com/send",
                entity,
                String.class
        );
    }
}
