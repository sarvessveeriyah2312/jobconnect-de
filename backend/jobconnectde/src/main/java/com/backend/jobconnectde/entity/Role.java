package com.backend.jobconnectde.entity;

import com.backend.jobconnectde.enums.RoleType;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "roles")
public class Role {

    @Id
    @org.hibernate.annotations.UuidGenerator
    @Column(name = "rid", updatable = false, nullable = false)
    private UUID rid;

    @Enumerated(EnumType.STRING)
    @Column(unique = true)
    private RoleType name;

    private String description;
}
