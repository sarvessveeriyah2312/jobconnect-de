package com.backend.jobconnectde.controller;

import com.backend.jobconnectde.entity.UserProfile;
import com.backend.jobconnectde.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/users/{userId}/profile")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    // ============================================================
    // 🔹 GET — Fetch user profile
    // ============================================================
    @GetMapping
    public ResponseEntity<UserProfile> getProfile(@PathVariable UUID userId) {
        log.info("Fetching profile for userId: {}", userId);
        Optional<UserProfile> profile = userProfileService.getByUserId(userId);
        return profile.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ============================================================
    // 🔹 POST — Save or update user profile details
    // ============================================================
    @PostMapping
    public ResponseEntity<?> saveProfile(
            @PathVariable UUID userId,
            @RequestBody(required = false) UserProfile details) {

        if (details == null) {
            log.warn("Empty profile payload for userId: {}", userId);
            return ResponseEntity.badRequest().body("Profile data is required.");
        }

        log.info("Saving profile for userId: {}", userId);
        UserProfile saved = userProfileService.saveOrUpdateProfile(userId, details);
        return ResponseEntity.status(HttpStatus.OK).body(saved);
    }

    // ============================================================
    // 🔹 POST — Upload profile picture (file upload)
    // ============================================================
    @PostMapping("/upload-picture")
    public ResponseEntity<?> uploadPicture(
            @PathVariable UUID userId,
            @RequestParam("file") MultipartFile file) {

        try {
            log.info("Uploading profile picture for userId: {}", userId);
            UserProfile updated = userProfileService.uploadProfilePicture(userId, file);
            return ResponseEntity.ok(updated);
        } catch (IOException e) {
            log.error("Error uploading profile picture for userId {}: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload profile picture.");
        }
    }

    // ============================================================
    // 🔹 POST — Upload Base64 image (used by Angular)
    // ============================================================
    @PostMapping("/upload-picture-base64")
    public ResponseEntity<?> uploadPictureBase64(
            @PathVariable UUID userId,
            @RequestBody(required = false) String base64Image) {

        if (base64Image == null || base64Image.isBlank()) {
            log.warn("Empty Base64 image payload for userId: {}", userId);
            return ResponseEntity.badRequest().body("Base64 image data is required.");
        }

        try {
            log.info("Uploading Base64 profile image for userId: {}", userId);
            UserProfile updated = userProfileService.uploadProfilePictureBase64(userId, base64Image);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            log.error("Error uploading Base64 image for userId {}: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload Base64 image.");
        }
    }
}
