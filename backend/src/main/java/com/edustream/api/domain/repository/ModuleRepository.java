package com.edustream.api.domain.repository;

import com.edustream.api.domain.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ModuleRepository extends JpaRepository<Module, UUID> {
    List<Module> findByCourseId(UUID courseId);
}