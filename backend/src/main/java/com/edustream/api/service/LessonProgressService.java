package com.edustream.api.service;

import com.edustream.api.domain.exception.ResourceNotFoundException;
import com.edustream.api.domain.model.*;
import com.edustream.api.domain.repository.EnrollmentRepository;
import com.edustream.api.domain.repository.LessonProgressRepository;
import com.edustream.api.domain.repository.LessonRepository;
import com.edustream.api.dto.LessonResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LessonProgressService {
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CertificateService certificateService;

    public LessonResponseDTO marcarAulaComoAssistida(UUID lessonId, User user){
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lição não encontrada com o ID fornecido."));

        Course course = lesson.getModule().getCourse();

        Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(user.getId(), course.getId())
                .orElseThrow(() -> new RuntimeException("Acesso negado! Você não está matriculado neste curso."));
        Optional<LessonProgress> progressOptional = lessonProgressRepository
                .findByEnrollmentIdAndLessonId(enrollment.getId(), lesson.getId());

        LessonProgress progress;

        if (progressOptional.isEmpty()) {
            progress = new LessonProgress();
            progress.setEnrollment(enrollment);
            progress.setLesson(lesson);
            progress.setWatched(true);
            progress.setWatchedAt(Instant.now());
        } else {
            progress = progressOptional.get();
            progress.setWatched(true);
            progress.setWatchedAt(Instant.now());
        }
        lessonProgressRepository.save(progress);

        long aulasAssistidas = lessonProgressRepository.countByEnrollmentIdAndIsWatchedTrue(enrollment.getId());
        long totalDeAulasDoCurso = course.getModules().stream()
                .flatMap(modulo -> modulo.getLessons().stream())
                .count();
        double novaPorcentagem = 0.0;
        if (totalDeAulasDoCurso > 0) {
            novaPorcentagem = ((double) aulasAssistidas * 100.0) / totalDeAulasDoCurso;
        }

        enrollment.setProgress(novaPorcentagem);
        enrollmentRepository.save(enrollment);

        if (enrollment.getProgress() >= 100.0){
            certificateService.emitirCertificado(user, course);
        }

        return new LessonResponseDTO(
                lesson.getId(),
                lesson.getTitle(),
                lesson.getDescription(),
                lesson.getVideoUrl(),
                lesson.getModule().getId()
        );
    }
}