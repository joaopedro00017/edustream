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
}
