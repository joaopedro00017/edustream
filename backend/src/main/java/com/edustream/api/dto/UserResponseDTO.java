package com.edustream.api.dto;

import com.edustream.api.domain.model.RoleName;

import java.util.Set;
import java.util.UUID;

public record UserResponseDTO(
        UUID id,
        String name,
        String email,
        Set<RoleName> roles
) {
}
