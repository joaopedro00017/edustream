package com.edustream.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record LessonRequestDTO(
        @NotBlank @Size(max = 150) String title,
        @NotBlank @Size(max = 2000) String description,
        @NotBlank @Size(max = 500) String videoUrl,
        @NotNull UUID moduleId
) {
}
