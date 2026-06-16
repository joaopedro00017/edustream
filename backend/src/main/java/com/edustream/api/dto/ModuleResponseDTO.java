package com.edustream.api.dto;

import java.util.UUID;

public record ModuleResponseDTO(
        UUID id,
        String title,
        String description,
        UUID courseId
) {
}