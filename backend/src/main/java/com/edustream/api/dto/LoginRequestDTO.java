package com.edustream.api.dto;

public record LoginRequestDTO(
        String email,
        String password
) {
}
