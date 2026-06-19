package com.productivity.backend.logout;

import com.productivity.backend.logout.LoginRequest;
import com.productivity.backend.logout.RegisterRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @GetMapping("/test")
public String test() {
    return "LOGIN BERHASIL NYAMBUNG";
}

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(
                "Register berhasil: " + request.getEmail()
        );
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(
            @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                "Login berhasil: " + request.getEmail()
        );
    }
    @PostMapping("/google")
    public ResponseEntity<String> googleLogin() {

    return ResponseEntity.ok(
            "Login Google berhasil"
    );
}

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logout berhasil");
    }
}