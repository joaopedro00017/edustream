package com.edustream.api.controller;

import com.edustream.api.domain.model.User;
import com.edustream.api.dto.CertificateResponseDTO;
import com.edustream.api.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CertificateController {
    private final CertificateService certificateService;

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Page<CertificateResponseDTO>> listarCertificados(@AuthenticationPrincipal User user, @PageableDefault(size = 12) Pageable pageable){
        Page<CertificateResponseDTO> certificados = certificateService.listarMeusCertificados(user, pageable);
        return ResponseEntity.ok().body(certificados);
    }

    @GetMapping("/validate/{hash}")
    public ResponseEntity<CertificateResponseDTO> validarCertificado(@PathVariable String hash){
        CertificateResponseDTO certificate = certificateService.validarCertificado(hash);
        return ResponseEntity.ok().body(certificate);
    }
}
