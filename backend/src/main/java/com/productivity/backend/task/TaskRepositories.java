package com.productivity.backend.task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepositories extends JpaRepository<TaskModel, UUID> {

    // Query otomatis dari JPA untuk mengambil semua task milik user tertentu
    List<TaskModel> findByUserId(UUID userId);
}
