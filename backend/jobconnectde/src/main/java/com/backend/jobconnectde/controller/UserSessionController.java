package com.backend.jobconnectde.controller;

import com.backend.jobconnectde.entity.UserSession;
import com.backend.jobconnectde.service.UserSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserSessionController {

    private final UserSessionService sessionService;

    @GetMapping
    public ResponseEntity<List<UserSession>> getSessions() {
        return ResponseEntity.ok(sessionService.getAllSessions());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> terminateSession(@PathVariable UUID id) {
        sessionService.terminateSession(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> terminateAllSessions() {
        sessionService.terminateAllSessions();
        return ResponseEntity.noContent().build();
    }
}
