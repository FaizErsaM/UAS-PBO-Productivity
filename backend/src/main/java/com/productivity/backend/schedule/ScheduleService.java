package com.productivity.backend.schedule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleEventRepository repository;

    // 1. Menyimpan jadwal baru
    public ScheduleEvent createEvent(ScheduleEvent event) {
        return repository.save(event);
    }

    // 2. Mengambil semua jadwal berdasarkan User ID dan Rentang Waktu
    public List<ScheduleEvent> getEventsByUserAndRange(UUID userId, ZonedDateTime start, ZonedDateTime end) {
        return repository.findByUserIdAndStartTimeBetween(userId, start, end);
    }

    // 3. Memperbarui jadwal yang sudah ada
    public ScheduleEvent updateEvent(UUID id, ScheduleEvent updatedEvent) {
        return repository.findById(id).map(event -> {
            event.setTitle(updatedEvent.getTitle());
            event.setDescription(updatedEvent.getDescription());
            event.setStartTime(updatedEvent.getStartTime());
            event.setEndTime(updatedEvent.getEndTime());
            return repository.save(event);
        }).orElseThrow(() -> new RuntimeException("Jadwal dengan ID " + id + " tidak ditemukan"));
    }

    // 4. Menghapus jadwal
    public void deleteEvent(UUID id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Jadwal dengan ID " + id + " tidak ditemukan");
        }
        repository.deleteById(id);
    }
}