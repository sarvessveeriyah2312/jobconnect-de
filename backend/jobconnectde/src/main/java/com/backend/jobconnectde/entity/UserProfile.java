package com.backend.jobconnectde.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "user_details")
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String address;
    private String city;
    private String state;
    private String country;
    private String phoneNumber;

    private LocalDate dateOfBirth;


    @Column(name = "profile_image_base64", columnDefinition = "TEXT", length = 16777215) // MEDIUMTEXT for MySQL
    private String profileImageBase64;


    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}