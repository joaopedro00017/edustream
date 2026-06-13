package com.edustream.api.domain.repository;

import com.edustream.api.domain.model.Role;
import com.edustream.api.domain.model.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RoleRepository extends JpaRepository<Role, UUID> {
    Optional<Role> findByName(RoleName name);
}
