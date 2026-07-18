package com.edustream.api.domain.repository;

import com.edustream.api.domain.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CourseRepository extends JpaRepository<Course, UUID> {
    long countByUserId(UUID userId);
    List<Course> findByUserId(UUID userId);
}
