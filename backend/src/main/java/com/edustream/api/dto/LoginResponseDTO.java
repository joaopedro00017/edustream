package com.edustream.api.dto;

public record LoginResponseDTO(
        String token,
        UserResponseDTO user
) {
}
