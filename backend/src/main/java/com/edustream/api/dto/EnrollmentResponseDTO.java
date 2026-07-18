package com.edustream.api.dto;

import java.time.Instant;
import java.util.UUID;

public record EnrollmentResponseDTO(
        UUID id,
        UUID courseId,
        String courseTitle,
        Instant enrollmentDate,
        Double progress
) {
}