package com.backend.jobconnectde.repository;

import com.backend.jobconnectde.entity.Role;
import com.backend.jobconnectde.enums.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleType name);
}
