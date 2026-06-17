package com.edustream.api.service;

import com.edustream.api.domain.exception.CustomAccessDeniedException;
import com.edustream.api.domain.exception.ResourceNotFoundException;
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

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ModuleService {
    private final ModuleRepository moduleRepository;
    private final CourseRepository courseRepository;

    public ModuleResponseDTO cadastrarModulo (ModuleRequestDTO dto, User user){
        Course cursoId = courseRepository.findById(dto.courseId())
                .orElseThrow(() -> new ResourceNotFoundException("Curso não encontrado"));
        if (!cursoId.getUser().getId().equals(user.getId())) {
            throw new CustomAccessDeniedException("Acesso negado! Você só pode adicionar módulos aos seus próprios cursos.");
        }
        Module module = new Module();
        module.setTitle(dto.title());
        module.setDescription(dto.description());
        module.setCourse(cursoId);

        var moduloSalvo = moduleRepository.save(module);
        return new ModuleResponseDTO(moduloSalvo.getId(),moduloSalvo.getTitle(),moduloSalvo.getDescription(),moduloSalvo.getCourse().getId());
    }

    public ModuleResponseDTO atualizarModulo(UUID id, ModuleRequestDTO dto, User user){
        Module module = moduleRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Modulo não encontrado"));
        if (!module.getCourse().getUser().getId().equals(user.getId())){
            throw new CustomAccessDeniedException("Acesso negado, alteração permitida apenas para o instrutor dono do curso!");
        }
        module.setTitle(dto.title());
        module.setDescription(dto.description());

        var moduloAtualizado = moduleRepository.save(module);
        return new ModuleResponseDTO(moduloAtualizado.getId(),moduloAtualizado.getTitle(),moduloAtualizado.getDescription(),moduloAtualizado.getCourse().getId());
    }

    public void excluirModulo (UUID id, User user){
        Module module = moduleRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Modulo não encontrado!"));
        if (!module.getCourse().getUser().getId().equals(user.getId())){
            throw new CustomAccessDeniedException("Acesso negado, exclusão permitida apenas para o instrutor dono do curso!");
        }
        moduleRepository.delete(module);
    }

    public List<ModuleResponseDTO> exibirModulos (UUID courseId){
        List<Module> module = moduleRepository.findByCourseId(courseId);
        return module.stream().map(module1 -> new ModuleResponseDTO(module1.getId(), module1.getTitle(), module1.getDescription(), module1.getCourse().getId())).toList();
    }
}