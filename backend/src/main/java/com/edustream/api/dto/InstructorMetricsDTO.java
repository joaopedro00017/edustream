package com.edustream.api.dto;

public record InstructorMetricsDTO (
        Long totalAlunos,
        Double taxaDeConclusaoMedia,
        Long cursosPublicados
){
}
