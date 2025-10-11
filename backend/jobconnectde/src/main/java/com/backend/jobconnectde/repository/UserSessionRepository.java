package com.backend.jobconnectde.repository;

import com.backend.jobconnectde.entity.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserSessionRepository extends JpaRepository<UserSession, UUID> {
}
