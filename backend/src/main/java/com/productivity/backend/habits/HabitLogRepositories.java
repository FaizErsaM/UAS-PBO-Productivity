package com.productivity.backend.habits;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface HabitLogRepositories extends JpaRepository<HabitLogModel, UUID> {
    // Mencari semua log check-in untuk satu habit tertentu
    List<HabitLogModel> findByHabitId(UUID habitId);

    // Mencari apakah hari ini user sudah check-in untuk habit tersebut (Biar gak bisa double klik)
    boolean existsByHabitIdAndCompletedDate(UUID habitId, LocalDate completedDate);

    // Menghapus semua log check-in milik satu habit (dipanggil sebelum habit dihapus)
    void deleteByHabitId(UUID habitId);
}