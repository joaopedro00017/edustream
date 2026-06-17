package com.edustream.api.controller;

import com.edustream.api.domain.model.User;
import com.edustream.api.dto.ModuleRequestDTO;
import com.edustream.api.dto.ModuleResponseDTO;
import com.edustream.api.service.ModuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ModuleController {
    private final ModuleService moduleService;

    @PreAuthorize("hasRole('INSTRUCTOR')")
    @PostMapping
    public ResponseEntity<ModuleResponseDTO> cadastrarModulo (@RequestBody ModuleRequestDTO dto, @AuthenticationPrincipal User user){
        ModuleResponseDTO moduloCadastrado = moduleService.cadastrarModulo(dto,user);
        return ResponseEntity.status(HttpStatus.CREATED).body(moduloCadastrado);
    }

    @PreAuthorize("hasRole('INSTRUCTOR')")
    @PutMapping("/{id}")
    public ResponseEntity<ModuleResponseDTO> atualizarModulo (@PathVariable UUID id, @RequestBody ModuleRequestDTO dto, @AuthenticationPrincipal User user){
        ModuleResponseDTO moduloAtualizado = moduleService.atualizarModulo(id,dto,user);
        return ResponseEntity.ok(moduloAtualizado);
    }

    @PreAuthorize("hasRole('INSTRUCTOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarModulo (@PathVariable UUID id, @AuthenticationPrincipal User user){
        moduleService.excluirModulo(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<ModuleResponseDTO>> listarModulos(@PathVariable UUID courseId) {
        List<ModuleResponseDTO> modulos = moduleService.exibirModulos(courseId);
        return ResponseEntity.ok(modulos);
    }
}
