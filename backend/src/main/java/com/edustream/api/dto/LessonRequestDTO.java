package com.edustream.api.dto;

import java.util.UUID;

public record LessonRequestDTO(
        String title,
        String description,
        String videoUrl,
        UUID moduleId
) {
}
