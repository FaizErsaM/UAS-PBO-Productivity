package com.productivity.backend.logout;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.productivity.backend.user.User;
import com.productivity.backend.user.UserRepository;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
public Object users() {
    return userRepository.findAll();
}
    

    @PostMapping("/register")
public ResponseEntity<?> register(
        @RequestBody RegisterRequest request) {

    Optional<User> existingUser =
            userRepository.findByEmail(request.getEmail());

    if (existingUser.isPresent()) {
        return ResponseEntity.badRequest()
                .body("Email sudah digunakan");
    }

    User user = new User();

    user.setUsername(request.getName());
    user.setEmail(request.getEmail());
    user.setPassword(request.getPassword());

    userRepository.save(user);
    User savedUser = userRepository.save(user);

System.out.println("USER TERSIMPAN = " + savedUser.getEmail());


    return ResponseEntity.ok("Register berhasil");
}

    @PostMapping("/login")
public ResponseEntity<?> login(
        @RequestBody LoginRequest request) {

    Optional<User> user =
            userRepository.findByEmail(request.getEmail());

    if (user.isEmpty()) {
        return ResponseEntity.badRequest()
                .body("Email tidak ditemukan");
    }

    if (!user.get().getPassword()
            .equals(request.getPassword())) {

        return ResponseEntity.badRequest()
                .body("Password salah");
    }

    return ResponseEntity.ok("Login berhasil");
}

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logout berhasil");
    }
}