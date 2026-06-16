package com.productivity.backend.habits;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface HabitsRepositories extends JpaRepository<HabitsModel, UUID> {
    List<HabitsModel> findByUserId(UUID userId);
}