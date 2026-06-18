package com.productivity.backend.dashboard;

import com.productivity.backend.task.TaskModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

// Dashboard tidak punya tabel sendiri di Supabase, jadi repository ini
// dipakai untuk query agregat (count) terhadap tabel "tasks".
// Untuk total habit, kita pakai HabitsRepositories yang sudah ada (lihat DashboardService).
@Repository
public interface DashboardRepositories extends JpaRepository<TaskModel, UUID> {

    int countByUserId(UUID userId);

    int countByUserIdAndCompleted(UUID userId, boolean completed);
}