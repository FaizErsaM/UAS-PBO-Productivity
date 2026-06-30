package com.productivity.backend.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")

public class AuthController {

    private final AuthService authService;

    // Menginjeksikan AuthService ke Controller
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/users")
    public Object users() {
        return authService.getAllUsers();
    }
    @PostMapping("/google/register")
    public ResponseEntity<?> googleRegister(@RequestBody GoogleLoginRequest request) {
        return authService.googleRegister(request);
    }

    @PostMapping("/google/login")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request) {
        return authService.googleLogin(request);
    }
    

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/verify-register-otp")
public ResponseEntity<?> verifyRegisterOtp(
        @RequestBody VerifyRegisterOtpRequest request
) {
    return authService.verifyRegisterOtp(request);
}

@PostMapping("/resend-register-otp")
public ResponseEntity<?> resendRegisterOtp(
        @RequestBody ResendRegisterOtpRequest request
){
    return authService.resendRegisterOtp(request);
}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        return authService.forgotPassword(request);

    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestBody VerifyOtpRequest request
    ) {

        return authService.verifyOtp(request);

    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequest request
    ) {

        return authService.resetPassword(request);

    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logout berhasil");
    }
}