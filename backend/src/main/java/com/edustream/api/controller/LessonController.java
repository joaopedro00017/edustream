package com.edustream.api.controller;

import com.edustream.api.domain.model.User;
import com.edustream.api.dto.LessonRequestDTO;
import com.edustream.api.dto.LessonResponseDTO;
import com.edustream.api.dto.ModuleResponseDTO;
import com.edustream.api.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class LessonController {

    private final LessonService lessonService;

    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<LessonResponseDTO> cadastrarAula(@RequestBody LessonRequestDTO dto, @AuthenticationPrincipal User user) {
        LessonResponseDTO aulaCadastrada = lessonService.cadastrarAula(dto, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(aulaCadastrada);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<LessonResponseDTO> atualizarAula(@PathVariable UUID id, @RequestBody LessonRequestDTO dto, @AuthenticationPrincipal User user){
        LessonResponseDTO aulaAtualizada = lessonService.atualizarAula(id, dto, user);
        return ResponseEntity.ok(aulaAtualizada);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Void> excluirAula (@PathVariable UUID id, @AuthenticationPrincipal User user){
        lessonService.deletarAula(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/module/{moduleId}")
    public ResponseEntity<List<LessonResponseDTO>> listarAulas(@PathVariable UUID moduleId) {
        List<LessonResponseDTO> aula = lessonService.listaAulas(moduleId);
        return ResponseEntity.ok(aula);
    }
}