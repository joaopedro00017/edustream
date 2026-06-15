package com.edustream.api.dto;

import java.util.UUID;

public record CourseResponseDTO(
UUID id,
String title,
String description,
String instructionName
) {
}
