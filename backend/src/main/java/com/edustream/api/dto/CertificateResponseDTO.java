package com.edustream.api.dto;

import java.time.Instant;
import java.util.UUID;

public record CertificateResponseDTO(
        UUID id,
        String studentName,
        String courseTitle,
        Instant generateAt,
        String validationHash
) {
}
