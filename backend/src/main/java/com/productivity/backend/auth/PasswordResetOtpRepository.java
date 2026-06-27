package com.productivity.backend.auth;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import jakarta.transaction.Transactional;

import java.util.Optional;
import java.util.UUID;

public interface PasswordResetOtpRepository
        extends JpaRepository<PasswordResetOtp, UUID> {

    Optional<PasswordResetOtp> findTopByEmailOrderByCreatedAtDesc(String email);

    @Transactional
    @Modifying
    void deleteByEmail(String email);

}