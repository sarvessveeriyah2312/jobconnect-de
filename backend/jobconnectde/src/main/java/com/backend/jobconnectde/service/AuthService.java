package com.backend.jobconnectde.service;

import com.backend.jobconnectde.dto.*;
import com.backend.jobconnectde.entity.*;
import com.backend.jobconnectde.enums.RoleType;
import com.backend.jobconnectde.repository.RoleRepository;
import com.backend.jobconnectde.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public JwtResponse register(RegisterRequest request) {
        logger.info("Registering new user: {}", request.getEmail());

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }

        RoleType roleType = (request.getRole() != null && request.getRole().equalsIgnoreCase("RECRUITER"))
                ? RoleType.RECRUITER : RoleType.JOB_APPLICANT;

        Role selectedRole = roleRepository.findByName(roleType)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleType));

        User newUser = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Collections.singleton(selectedRole))
                .build();

        userRepository.save(newUser);

        String token = jwtService.generateToken(newUser.getEmail(), selectedRole.getName().name());

        logger.info("User {} registered successfully with role {}", newUser.getEmail(), selectedRole.getName());

        return JwtResponse.builder()
                .token(token)
                .email(newUser.getEmail())
                .role(selectedRole.getName().name())
                .fullName(newUser.getFullName())
                .build();
    }

    public JwtResponse login(LoginRequest request) {
        logger.info("User login attempt: {}", request.getEmail());

        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // ✅ FIX: Set authentication in SecurityContext
            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (BadCredentialsException e) {
            logger.warn("Invalid credentials for email: {}", request.getEmail());
            throw new BadCredentialsException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role firstRole = user.getRoles().iterator().next();
        String token = jwtService.generateToken(user.getEmail(), firstRole.getName().name());

        return JwtResponse.builder()
                .userId(user.getUid())
                .token(token)
                .email(user.getEmail())
                .role(firstRole.getName().name())
                .fullName(user.getFullName())
                .build();
    }
}