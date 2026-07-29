package com.edustream.api.domain.repository;

import com.edustream.api.domain.model.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface LessonProgressRepository extends JpaRepository<LessonProgress, UUID> {
    Optional<LessonProgress> findByEnrollmentIdAndLessonId(UUID enrollmentId, UUID lessonId);
    long countByEnrollmentIdAndIsWatchedTrue(UUID enrollmentId);

    boolean existsByLessonId(UUID lessonId);
    boolean existsByLesson_ModuleId(UUID moduleId);
    boolean existsByLesson_Module_CourseId(UUID courseId);
}