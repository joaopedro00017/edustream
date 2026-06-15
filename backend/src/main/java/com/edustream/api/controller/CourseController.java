package com.edustream.api.controller;

import com.edustream.api.domain.model.User;
import com.edustream.api.dto.CourseRequestDTO;
import com.edustream.api.dto.CourseResponseDTO;
import com.edustream.api.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {
    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<List<CourseResponseDTO>> listarCursos(){
        List<CourseResponseDTO> listarCursos = courseService.listarCursos();
        return ResponseEntity.ok(listarCursos);
    }

    @PreAuthorize("hasRole('INSTRUCTOR')")
    @PostMapping
    public ResponseEntity<CourseResponseDTO> salvarCurso(@RequestBody CourseRequestDTO requestDTO, @AuthenticationPrincipal User user){
        CourseResponseDTO cursoSalvo = courseService.cadastrarCurso(user, requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(cursoSalvo);
    }

    @PreAuthorize("hasRole('INSTRUCTOR')")
    @PutMapping("/{id}")
    public ResponseEntity<CourseResponseDTO> atualizarCurso (@PathVariable UUID id, @RequestBody CourseRequestDTO dto, @AuthenticationPrincipal User user){
        CourseResponseDTO cursoAtualizado = courseService.atualizarCurso(id,dto,user);
        return ResponseEntity.ok(cursoAtualizado);
    }

    @PreAuthorize("hasRole('INSTRUCTOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCurso(@PathVariable UUID id,@AuthenticationPrincipal User user){
        courseService.deletarCurso(id, user);
        return ResponseEntity.noContent().build();
    }
}
