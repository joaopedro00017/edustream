package com.edustream.api.service;

import com.edustream.api.domain.model.User;
import com.edustream.api.domain.repository.CourseRepository;
import com.edustream.api.domain.repository.EnrollmentRepository;
import com.edustream.api.dto.InstructorMetricsDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InstructorDashboardService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;

    @Transactional(readOnly = true)
    public InstructorMetricsDTO obterMetricasDoInstrutor(User instructor) {
        Long totalAlunos = enrollmentRepository.countByCourseUserId(instructor.getId());
        Double taxaDeConclusaoMedia = enrollmentRepository.findAverageProgressByCourseInstructorId(instructor.getId())
                .orElse(0.0);
        Long cursosPublicados = courseRepository.countByUserId(instructor.getId());

        return new InstructorMetricsDTO(totalAlunos, taxaDeConclusaoMedia, cursosPublicados);
    }
}