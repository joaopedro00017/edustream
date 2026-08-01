package com.edustream.api.controller;

import com.edustream.api.domain.model.User;
import com.edustream.api.dto.LessonResponseDTO;
import com.edustream.api.service.LessonProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/lessons-progress")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class LessonProgressController {
    private final LessonProgressService lessonProgressService;

    @PostMapping("/{lessonId}/watch")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<LessonResponseDTO> marcarComoAssistida(@PathVariable UUID lessonId, @AuthenticationPrincipal User user){
        LessonResponseDTO lesson = lessonProgressService.marcarAulaComoAssistida(lessonId, user);
        return ResponseEntity.ok().body(lesson);
    }
}
