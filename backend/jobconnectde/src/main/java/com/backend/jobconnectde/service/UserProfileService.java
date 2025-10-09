package com.backend.jobconnectde.service;

import com.backend.jobconnectde.entity.User;
import com.backend.jobconnectde.entity.UserProfile;
import com.backend.jobconnectde.repository.UserProfileRepository;
import com.backend.jobconnectde.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    // ============================================================
    // 🔹 Create or Update user profile
    // ============================================================
    public UserProfile saveOrUpdateProfile(UUID userId, UserProfile details) {
        log.info("Saving or updating profile for userId: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        UserProfile profile = userProfileRepository.findByUserUid(userId)
                .orElseGet(() -> {
                    log.info("No existing profile found — creating new for userId: {}", userId);
                    UserProfile newProfile = new UserProfile();
                    newProfile.setUser(user);
                    return newProfile;
                });

        // Only update non-null fields (avoid overwriting existing data)
        if (details.getAddress() != null) profile.setAddress(details.getAddress());
        if (details.getCity() != null) profile.setCity(details.getCity());
        if (details.getState() != null) profile.setState(details.getState());
        if (details.getCountry() != null) profile.setCountry(details.getCountry());
        if (details.getPhoneNumber() != null) profile.setPhoneNumber(details.getPhoneNumber());
        if (details.getDateOfBirth() != null) profile.setDateOfBirth(details.getDateOfBirth());
        if (details.getProfileImageBase64() != null) profile.setProfileImageBase64(details.getProfileImageBase64());

        UserProfile saved = userProfileRepository.save(profile);
        log.info("Profile saved successfully for userId: {}", userId);
        return saved;
    }

    // ============================================================
    // 🔹 Upload profile picture (Multipart file)
    // ============================================================
    public UserProfile uploadProfilePicture(UUID userId, MultipartFile file) throws IOException {
        log.info("Uploading profile picture for userId: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        UserProfile profile = userProfileRepository.findByUserUid(userId)
                .orElseGet(() -> {
                    log.info("No profile found — creating new profile for userId: {}", userId);
                    UserProfile newProfile = new UserProfile();
                    newProfile.setUser(user);
                    return newProfile;
                });

        byte[] imageBytes = file.getBytes();
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);
        profile.setProfileImageBase64(base64Image);

        UserProfile saved = userProfileRepository.save(profile);
        log.info("Profile picture uploaded successfully for userId: {}", userId);
        return saved;
    }

    // ============================================================
    // 🔹 Upload profile picture (Base64 string from Angular)
    // ============================================================
    public UserProfile uploadProfilePictureBase64(UUID userId, String base64Image) {
        log.info("Uploading Base64 profile image for userId: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        UserProfile profile = userProfileRepository.findByUserUid(userId)
                .orElseGet(() -> {
                    log.info("No profile found — creating new profile for userId: {}", userId);
                    UserProfile newProfile = new UserProfile();
                    newProfile.setUser(user);
                    return newProfile;
                });

        profile.setProfileImageBase64(base64Image);

        UserProfile saved = userProfileRepository.save(profile);
        log.info("Base64 profile image uploaded successfully for userId: {}", userId);
        return saved;
    }

    // ============================================================
    // 🔹 Retrieve profile by userId
    // ============================================================
    public Optional<UserProfile> getByUserId(UUID userId) {
        log.debug("Fetching profile for userId: {}", userId);
        return userProfileRepository.findByUserUid(userId);
    }
}
