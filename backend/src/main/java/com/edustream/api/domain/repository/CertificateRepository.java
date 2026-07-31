package com.edustream.api.domain.repository;

import com.edustream.api.domain.model.Certificate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CertificateRepository extends JpaRepository<Certificate, UUID> {
    Optional<Certificate> findByValidationHash (String validationHash);
    Page<Certificate> findByUserId(UUID userId, Pageable pageable);
}
