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

public class ScheduleController {

    @Autowired
    private ScheduleService service;

    @PostMapping
    public ResponseEntity<ScheduleEvent> createEvent(@RequestBody ScheduleEvent event) {
        ScheduleEvent savedEvent = service.createEvent(event);
        return ResponseEntity.ok(savedEvent);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ScheduleEvent>> getEvents(
            @PathVariable UUID userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime end) {
        
        List<ScheduleEvent> events = service.getEventsByUserAndRange(userId, start, end);
        return ResponseEntity.ok(events);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ScheduleEvent> updateEvent(
            @PathVariable UUID id, 
            @RequestBody ScheduleEvent event) {
        return ResponseEntity.ok(service.updateEvent(id, event));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEvent(@PathVariable UUID id) {
        service.deleteEvent(id);
        return ResponseEntity.ok("Jadwal berhasil dihapus");
    }
}