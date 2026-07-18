package com.edustream.api.service;

import com.edustream.api.domain.model.Course;
import com.edustream.api.domain.model.Enrollment;
import com.edustream.api.domain.model.User;
import com.edustream.api.domain.repository.CourseRepository;
import com.edustream.api.domain.repository.EnrollmentRepository;
import com.edustream.api.domain.exception.ResourceNotFoundException;
import com.edustream.api.dto.EnrollmentResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;

    @Transactional
    public EnrollmentResponseDTO matricularAluno(UUID courseId, User user) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Curso não encontrado com o ID fornecido."));
        if (enrollmentRepository.existsByUserIdAndCourseId(user.getId(), courseId)) {
            throw new RuntimeException("Você já está matriculado neste curso.");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);
        enrollment.setEnrollmentDate(Instant.now());
        enrollment.setProgress(0.0);

        Enrollment matriculaSalva = enrollmentRepository.save(enrollment);

        return new EnrollmentResponseDTO(
                matriculaSalva.getId(),
                course.getId(),
                course.getTitle(),
                matriculaSalva.getEnrollmentDate(),
                matriculaSalva.getProgress()
        );
    }

    public List<EnrollmentResponseDTO> listarMinhasMatriculas(User user) {
        List<Enrollment> matriculas = enrollmentRepository.findByUserId(user.getId());

        return matriculas.stream()
                .map(m -> new EnrollmentResponseDTO(
                        m.getId(),
                        m.getCourse().getId(),
                        m.getCourse().getTitle(),
                        m.getEnrollmentDate(),
                        m.getProgress()
                )).toList();
    }
}