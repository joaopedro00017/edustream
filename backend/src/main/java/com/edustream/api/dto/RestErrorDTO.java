package com.edustream.api.dto;

import java.time.Instant;

public record RestErrorDTO(
        Instant timestamp,
        String message
) {}
