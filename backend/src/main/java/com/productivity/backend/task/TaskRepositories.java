package com.productivity.backend.task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepositories extends JpaRepository<TaskModel, UUID> {

    // Query otomatis dari JPA untuk mengambil semua task milik user tertentu
    List<TaskModel> findByUserId(UUID userId);

    // Task yang BELUM selesai & deadline-nya berada dalam rentang [start, end].
    // Dipakai scheduler untuk cari task yang mendekati deadline.
    List<TaskModel> findByCompletedFalseAndDeadlineBetween(ZonedDateTime start, ZonedDateTime end);

    // Task yang BELUM selesai & deadline-nya sudah lewat (deadline < cutoff).
    // Dipakai scheduler untuk cari task yang terlambat.
    List<TaskModel> findByCompletedFalseAndDeadlineBefore(ZonedDateTime cutoff);
}
