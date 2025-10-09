package com.backend.jobconnectde.dto;

import lombok.*;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    private UUID userId;
    private String token;
    private String email;
    private String role;
    private String fullName;
}
