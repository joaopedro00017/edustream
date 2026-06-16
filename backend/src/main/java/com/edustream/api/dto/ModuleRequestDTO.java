package com.edustream.api.dto;

import java.util.UUID;

public record ModuleRequestDTO(
        String title,
        String description,
        UUID courseId
) {
}