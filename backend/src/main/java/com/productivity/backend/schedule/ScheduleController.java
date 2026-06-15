package com.productivity.backend.schedule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/schedule")
@CrossOrigin(origins = "*") // Mengizinkan React mengakses API ini dari port yang berbeda
public class ScheduleController {

    @Autowired
    private ScheduleService service;

    // Endpoint untuk membuat jadwal baru (POST http://localhost:8080/api/schedule)
    @PostMapping
    public ResponseEntity<ScheduleEvent> createEvent(@RequestBody ScheduleEvent event) {
        ScheduleEvent savedEvent = service.createEvent(event);
        return ResponseEntity.ok(savedEvent);
    }

    // Endpoint untuk mengambil jadwal kalender (GET http://localhost:8080/api/schedule/user/{userId}?start=...&end=...)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ScheduleEvent>> getEvents(
            @PathVariable UUID userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime end) {
        
        List<ScheduleEvent> events = service.getEventsByUserAndRange(userId, start, end);
        return ResponseEntity.ok(events);
    }

    // Endpoint untuk memperbarui jadwal (PUT http://localhost:8080/api/schedule/{id})
    @PutMapping("/{id}")
    public ResponseEntity<ScheduleEvent> updateEvent(
            @PathVariable UUID id, 
            @RequestBody ScheduleEvent event) {
        return ResponseEntity.ok(service.updateEvent(id, event));
    }

    // Endpoint untuk menghapus jadwal (DELETE http://localhost:8080/api/schedule/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEvent(@PathVariable UUID id) {
        service.deleteEvent(id);
        return ResponseEntity.ok("Jadwal berhasil dihapus");
    }
}