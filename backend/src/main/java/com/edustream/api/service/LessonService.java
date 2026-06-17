package com.edustream.api.service;

import com.edustream.api.domain.exception.CustomAccessDeniedException;
import com.edustream.api.domain.exception.ResourceNotFoundException;
import com.edustream.api.domain.model.Lesson;
import com.edustream.api.domain.model.Module;
import com.edustream.api.domain.model.User;
import com.edustream.api.domain.repository.LessonRepository;
import com.edustream.api.domain.repository.ModuleRepository;
import com.edustream.api.dto.LessonRequestDTO;
import com.edustream.api.dto.LessonResponseDTO;
import com.edustream.api.dto.ModuleResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LessonService {
    private final LessonRepository lessonRepository;
    private final ModuleRepository moduleRepository;

    public LessonResponseDTO cadastrarAula(LessonRequestDTO dto, User user) {
        Module module = moduleRepository.findById(dto.moduleId())
                .orElseThrow(() -> new ResourceNotFoundException("Módulo não encontrado"));
        if (!module.getCourse().getUser().getId().equals(user.getId())) {
            throw new CustomAccessDeniedException("Acesso negado! Não é o dono do curso deste módulo.");
        }

        Lesson lesson = new Lesson();
        lesson.setTitle(dto.title());
        lesson.setDescription(dto.description());
        lesson.setVideoUrl(dto.videoUrl());
        lesson.setModule(module);

        Lesson aulaSalva = lessonRepository.save(lesson);

        return new LessonResponseDTO(aulaSalva.getId(), aulaSalva.getTitle(), aulaSalva.getDescription(), aulaSalva.getVideoUrl(), aulaSalva.getModule().getId());
    }

    public LessonResponseDTO atualizarAula(UUID id, LessonRequestDTO dto, User user){
        Lesson aula = lessonRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Modulo não encontrado"));
        if (!aula.getModule().getCourse().getUser().getId().equals(user.getId())){
            throw new CustomAccessDeniedException("Acesso negado, alteração permitida apenas para o instrutor dono do curso deste modulo!");
        }
        aula.setTitle(dto.title());
        aula.setDescription(dto.description());
        aula.setVideoUrl(dto.videoUrl());

        var aulaAtualizada = lessonRepository.save(aula);
        return new LessonResponseDTO(aulaAtualizada.getId(),aulaAtualizada.getTitle(), aulaAtualizada.getDescription(), aulaAtualizada.getVideoUrl(), aulaAtualizada.getModule().getId());
    }

    public void deletarAula(UUID id, User user){
        Lesson aula = lessonRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Lição não encontrada"));
        if (!aula.getModule().getCourse().getUser().getId().equals(user.getId())){
            throw new CustomAccessDeniedException("Acesso negado, exclusão permitida apenas para o instrutor dono do curso deste modulo!");
        }
        lessonRepository.delete(aula);
    }

    public List<LessonResponseDTO> listaAulas (UUID moduleId){
        List<Lesson> aula = lessonRepository.findByModuleId(moduleId);
        return aula.stream().map(aula1 -> new LessonResponseDTO(aula1.getId(), aula1.getTitle(), aula1.getDescription(), aula1.getVideoUrl(), aula1.getModule().getId())).toList();
    }
}