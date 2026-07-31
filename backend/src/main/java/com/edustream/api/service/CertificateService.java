package com.edustream.api.service;

import com.edustream.api.domain.exception.ResourceNotFoundException;
import com.edustream.api.domain.model.Certificate;
import com.edustream.api.domain.model.Course;
import com.edustream.api.domain.model.User;
import com.edustream.api.domain.repository.CertificateRepository;
import com.edustream.api.dto.CertificateResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CertificateService {
    private final CertificateRepository certificateRepository;

    public void emitirCertificado(User user, Course course){
        Certificate certificate = new Certificate();
        certificate.setUser(user);
        certificate.setCourse(course);
        certificate.setGenerateAt(Instant.now());

        String hashAleatorio = UUID.randomUUID().toString();
        certificate.setValidationHash(hashAleatorio);

        certificateRepository.save(certificate);
    }

    public Page<CertificateResponseDTO> listarMeusCertificados(User user, Pageable pageable){
        return certificateRepository.findByUserId(user.getId(), pageable)
                .map(cert -> new CertificateResponseDTO(
                        cert.getId(),
                        cert.getUser().getName(),
                        cert.getCourse().getTitle(),
                        cert.getGenerateAt(),
                        cert.getValidationHash()
                ));
    }

    public CertificateResponseDTO validarCertificado(String hash){
        Certificate cert = certificateRepository.findByValidationHash(hash)
                .orElseThrow(() -> new ResourceNotFoundException("Certificado não encontrado"));

        // Converte a entidade Certificate para o DTO correto
        return new CertificateResponseDTO(
                cert.getId(),
                cert.getUser().getName(),
                cert.getCourse().getTitle(),
                cert.getGenerateAt(),
                cert.getValidationHash()
        );
    }
}
