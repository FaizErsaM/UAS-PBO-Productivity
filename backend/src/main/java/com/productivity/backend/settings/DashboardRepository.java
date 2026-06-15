package com.productivity.backend.settings;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DashboardRepository extends JpaRepository<DashboardModel, Long> {
    Optional<DashboardModel> findByUserId(String userId);
}
