package com.edustream.api.service;

import com.edustream.api.domain.model.Course;
import com.edustream.api.domain.model.User;
import com.edustream.api.domain.repository.CourseRepository;
import com.edustream.api.dto.CourseRequestDTO;
import com.edustream.api.dto.CourseResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;

    public CourseResponseDTO cadastrarCurso(User user, CourseRequestDTO dto){
        Course curso = new Course();
        curso.setTitle(dto.title());
        curso.setDescription(dto.description());
        curso.setUser(user);

        var cursoSalvo = courseRepository.save(curso);
        return new CourseResponseDTO(cursoSalvo.getId(), cursoSalvo.getTitle(), cursoSalvo.getDescription(), cursoSalvo.getUser().getName());
    }

    public List<CourseResponseDTO> listarCursos(){
        return courseRepository.findAll().stream().map(curso -> new CourseResponseDTO(curso.getId(), curso.getTitle(), curso.getDescription(), curso.getUser().getName())).toList();
    }

    public CourseResponseDTO atualizarCurso (UUID id, CourseRequestDTO dto, User user){
        Course curso = courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Curso não encontrado"));
        if (!curso.getUser().getId().equals(user.getId())){
            throw new RuntimeException("Acesso negado, alteração permitida apenas para o instrutor dono do curso!");
        }
        curso.setTitle(dto.title());
        curso.setDescription(dto.description());

        var cursoAtualizado = courseRepository.save(curso);

        return new CourseResponseDTO(cursoAtualizado.getId(),cursoAtualizado.getTitle(),cursoAtualizado.getDescription(), cursoAtualizado.getUser().getName());
    }

    public void deletarCurso(UUID id, User user){
        Course curso = courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Curso não encontrado"));
        if (!curso.getUser().getId().equals(user.getId())){
            throw new RuntimeException("Acesso negado, exclusão permitida apenas para o instrutor dono do curso!");
        }
        courseRepository.delete(curso);
    }
}
