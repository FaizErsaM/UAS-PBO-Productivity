package com.productivity.backend.settings;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SettingRepository extends JpaRepository<SettingModel, Long> {
    Optional<SettingModel> findByUserId(String userId);
}
