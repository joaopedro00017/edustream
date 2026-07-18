package com.edustream.api.domain.repository;

import com.edustream.api.domain.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {
    boolean existsByUserIdAndCourseId(UUID userId, UUID courseId);
    List<Enrollment> findByUserId(UUID userId);
    Optional<Enrollment> findByUserIdAndCourseId(UUID userId, UUID courseId);

    long countByCourseUserId(UUID instructorId);

    @Query("SELECT AVG(e.progress) FROM Enrollment e WHERE e.course.user.id = :instructorId")
    Optional<Double> findAverageProgressByCourseInstructorId(UUID instructorId);
}