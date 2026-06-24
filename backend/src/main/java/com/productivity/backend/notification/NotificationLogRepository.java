package com.productivity.backend.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface NotificationLogRepository extends JpaRepository<NotificationLog, UUID> {

    // Cek apakah email untuk (taskId, eventType) sudah pernah dikirim
    boolean existsByTaskIdAndEventType(UUID taskId, String eventType);

    // Hapus log untuk task tertentu (mis. jika task dihapus atau deadline di-extend jauh)
    void deleteByTaskId(UUID taskId);
}
