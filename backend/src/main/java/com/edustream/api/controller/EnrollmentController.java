package com.edustream.api.controller;

import com.edustream.api.domain.model.User;
import com.edustream.api.dto.EnrollmentResponseDTO;
import com.edustream.api.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class EnrollmentController {
    private final EnrollmentService enrollmentService;

    @PostMapping("/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<EnrollmentResponseDTO> matricular(@PathVariable UUID courseId, @AuthenticationPrincipal User user) {
        EnrollmentResponseDTO resposta = enrollmentService.matricularAluno(courseId, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }

    @GetMapping("/my-courses")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<EnrollmentResponseDTO>> listarMeusCursos(@AuthenticationPrincipal User user) {
        List<EnrollmentResponseDTO> resposta = enrollmentService.listarMinhasMatriculas(user);
        return ResponseEntity.ok(resposta);
    }
}