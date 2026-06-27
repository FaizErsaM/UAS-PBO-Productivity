package com.productivity.backend.auth;

import java.security.SecureRandom;

import org.springframework.stereotype.Service;

@Service
public class OtpService {

    private final SecureRandom random = new SecureRandom();

    public String generateOtp() {

        int otp = 100000 + random.nextInt(900000);

        return String.valueOf(otp);

    }

}