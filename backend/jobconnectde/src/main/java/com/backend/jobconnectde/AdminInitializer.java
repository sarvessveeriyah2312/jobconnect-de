package com.backend.jobconnectde;

import com.backend.jobconnectde.entity.*;
import com.backend.jobconnectde.enums.RoleType;
import com.backend.jobconnectde.repository.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;

@Configuration
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminInitializer.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Ensure roles exist
        for (RoleType type : RoleType.values()) {
            roleRepository.findByName(type)
                    .orElseGet(() -> roleRepository.save(Role.builder().name(type).build()));
        }

        // Create super admin if not exists
        String adminEmail = "admin@jobconnect.de";
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            Role adminRole = roleRepository.findByName(RoleType.ADMIN)
                    .orElseThrow(() -> new RuntimeException("SUPER_ADMIN role not found"));

            User admin = User.builder()
                    .fullName("System Administrator")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("Admin@123"))
                    .roles(Collections.singleton(adminRole))
                    .build();

            userRepository.save(admin);
            logger.info("Super Admin created: " + adminEmail + " / Admin@123");
        } else {
            logger.info("Super Admin already exists.");
        }
    }
}