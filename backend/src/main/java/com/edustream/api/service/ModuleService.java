package com.edustream.api.service;

import com.edustream.api.domain.model.Course;
import com.edustream.api.domain.model.Module;
import com.edustream.api.domain.model.User;
import com.edustream.api.domain.repository.CourseRepository;
import com.edustream.api.domain.repository.ModuleRepository;
import com.edustream.api.dto.ModuleRequestDTO;
import com.edustream.api.dto.ModuleResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ModuleService {
    private final ModuleRepository moduleRepository;
    private final CourseRepository courseRepository;

    public ModuleResponseDTO cadastrarModulo (ModuleRequestDTO dto, User user){
        Course cursoId = courseRepository.findById(dto.courseId())
                .orElseThrow(() -> new RuntimeException("Curso não encontrado"));
        if (!cursoId.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Acesso negado! Você só pode adicionar módulos aos seus próprios cursos.");
        }
        Module module = new Module();
        module.setTitle(dto.title());
        module.setDescription(dto.description());
        module.setCourse(cursoId);

        var moduloSalvo = moduleRepository.save(module);
        return new ModuleResponseDTO(moduloSalvo.getId(),moduloSalvo.getTitle(),moduloSalvo.getDescription(),moduloSalvo.getCourse().getId());
    }
}
