package com.backend.jobconnectde.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String email;
    private String role;
    private String fullName;
}
