package com.edustream.api.domain.repository;

import com.edustream.api.domain.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CertificateRepository extends JpaRepository<Certificate, UUID> {
    Optional<Certificate> findByValidationHash (String validationHash);
    List<Certificate> findByUserId(UUID userId);
}
