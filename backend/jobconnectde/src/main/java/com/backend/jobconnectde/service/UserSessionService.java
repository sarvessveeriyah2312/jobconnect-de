package com.backend.jobconnectde.service;

import com.backend.jobconnectde.entity.UserSession;
import com.backend.jobconnectde.repository.UserSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserSessionService {

    private final UserSessionRepository sessionRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /** 🔹 Create new session entry */
    public void createSession(String email, String role, String ip, String userAgent) {
        UserSession session = UserSession.builder()
                .username(email)
                .role(role)
                .ipAddress(ip)
                .userAgent(userAgent)
                .loginTime(LocalDateTime.now())
                .lastActive(LocalDateTime.now())
                .status(UserSession.SessionStatus.ACTIVE)
                .build();

        sessionRepository.save(session);
    }

    /** 🔹 Get all active sessions */
    public List<UserSession> getAllSessions() {
        return sessionRepository.findAll();
    }

    /** 🔹 Terminate and delete a session */
    public void terminateSession(UUID sessionId) {
        sessionRepository.findById(sessionId).ifPresent(session -> {
            // Notify the frontend before removal
            messagingTemplate.convertAndSend(
                    "/topic/session-events",
                    Map.of(
                            "type", "SESSION_TERMINATED",
                            "sessionId", sessionId.toString(),
                            "username", session.getUsername()
                    )
            );

            // Delete from DB instead of updating status
            sessionRepository.delete(session);
        });
    }

    /** 🔹 Terminate and delete all sessions */
    public void terminateAllSessions() {
        List<UserSession> sessions = sessionRepository.findAll();

        // Notify frontend before deleting
        sessions.forEach(s -> messagingTemplate.convertAndSend(
                "/topic/session-events",
                Map.of(
                        "type", "SESSION_TERMINATED",
                        "sessionId", s.getId().toString(),
                        "username", s.getUsername()
                )
        ));

        // Bulk delete
        sessionRepository.deleteAll(sessions);
    }
}
