package com.edustream.api.controller;

import com.edustream.api.domain.model.User;
import com.edustream.api.dto.InstructorMetricsDTO;
import com.edustream.api.service.InstructorDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/instructor")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class InstructorController {

    private final InstructorDashboardService instructorDashboardService;

    @GetMapping("/metrics")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<InstructorMetricsDTO> obterMetrics(@AuthenticationPrincipal User instructor) {
        InstructorMetricsDTO metrics = instructorDashboardService.obterMetricasDoInstrutor(instructor);
        return ResponseEntity.ok().body(metrics);
    }
}