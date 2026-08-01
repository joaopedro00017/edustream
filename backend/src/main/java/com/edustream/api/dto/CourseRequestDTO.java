package com.edustream.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CourseRequestDTO(
        @NotBlank @Size(max = 150) String title,
        @NotBlank @Size(max = 2000) String description
) {
}
