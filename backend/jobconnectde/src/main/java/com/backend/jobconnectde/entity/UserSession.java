package com.backend.jobconnectde.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String username;
    private String role;
    private String ipAddress;
    private String userAgent;

    private LocalDateTime loginTime;
    private LocalDateTime lastActive;

    @Enumerated(EnumType.STRING)
    private SessionStatus status;

    public enum SessionStatus {
        ACTIVE,
        TERMINATED
    }
}
