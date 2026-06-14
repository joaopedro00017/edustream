package com.edustream.api.controller;

import com.edustream.api.dto.LoginRequestDTO;
import com.edustream.api.dto.TokenResponseDTO;
import com.edustream.api.dto.UserRegisterDTO;
import com.edustream.api.dto.UserResponseDTO;
import com.edustream.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@RequestBody UserRegisterDTO dto){
        UserResponseDTO resultadoDoServico = userService.registerUser(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(resultadoDoServico);
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponseDTO> login(@RequestBody LoginRequestDTO dto) {
        TokenResponseDTO token = userService.loginUser(dto);
        return ResponseEntity.ok(token);
    }
}