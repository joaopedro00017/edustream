package com.edustream.api.service;

import com.edustream.api.domain.model.Course;
import com.edustream.api.domain.model.Enrollment;
import com.edustream.api.domain.model.User;
import com.edustream.api.domain.repository.CourseRepository;
import com.edustream.api.domain.repository.EnrollmentRepository;
import com.edustream.api.domain.exception.ConflictException;
import com.edustream.api.domain.exception.CustomAccessDeniedException;
import com.edustream.api.domain.exception.ResourceNotFoundException;
import com.edustream.api.dto.EnrolledStudentDTO;
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
            throw new ConflictException("Você já está matriculado neste curso.");
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

    public List<EnrolledStudentDTO> listarAlunosMatriculados(UUID courseId, User instructor) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Curso não encontrado"));
        if (!course.getUser().getId().equals(instructor.getId())) {
            throw new CustomAccessDeniedException("Acesso negado, apenas o instrutor dono do curso pode ver os alunos matriculados.");
        }

        List<Enrollment> matriculas = enrollmentRepository.findByCourseId(courseId);

        return matriculas.stream()
                .map(m -> new EnrolledStudentDTO(
                        m.getUser().getId(),
                        m.getUser().getName(),
                        m.getUser().getEmail(),
                        m.getProgress()
                )).toList();
    }
}