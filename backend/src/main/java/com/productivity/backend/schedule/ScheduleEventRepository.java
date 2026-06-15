package com.productivity.backend.schedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ScheduleEventRepository extends JpaRepository<ScheduleEvent, UUID> {
    
    // Query otomatis dari JPA untuk mengambil jadwal user dalam rentang waktu tertentu
    List<ScheduleEvent> findByUserIdAndStartTimeBetween(UUID userId, ZonedDateTime start, ZonedDateTime end);
}