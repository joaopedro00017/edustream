package com.edustream.api.domain.repository;

import com.edustream.api.domain.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LessonRepository extends JpaRepository<Lesson, UUID> {
    List<Lesson> findByModuleId(UUID moduleId);
}
