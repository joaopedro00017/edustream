package com.edustream.api.dto;

import java.util.UUID;

public record EnrolledStudentDTO(
        UUID studentId,
        String studentName,
        String studentEmail,
        Double progress
) {
}
