package com.edustream.api.service;

import com.edustream.api.domain.model.Role;
import com.edustream.api.domain.model.RoleName;
import com.edustream.api.domain.model.User;
import com.edustream.api.domain.repository.RoleRepository;
import com.edustream.api.domain.repository.UserRepository;
import com.edustream.api.dto.LoginRequestDTO;
import com.edustream.api.dto.LoginResponseDTO;
import com.edustream.api.dto.UserRegisterDTO;
import com.edustream.api.dto.UserResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @Transactional
    public UserResponseDTO registerUser(UserRegisterDTO dto){
        if (userRepository.findByEmail(dto.email()).isPresent()){
            throw new RuntimeException("E-mail já cadastrado no sistema!");
        }

        RoleName roleName = resolveRoleName(dto.role());
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role não encontrado no banco de dados!"));

        User user = new User();
        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.getRoles().add(role);
        User savedUser = userRepository.save(user);

        return toUserResponseDTO(savedUser);
    }

    private UserResponseDTO toUserResponseDTO(User user) {
        Set<RoleName> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                roleNames
        );
    }

    private RoleName resolveRoleName(String role) {
        if (role == null || role.isBlank()) {
            return RoleName.ROLE_STUDENT;
        }

        String nomeNormalizado = role.trim().toUpperCase();
        if (!nomeNormalizado.startsWith("ROLE_")) {
            nomeNormalizado = "ROLE_" + nomeNormalizado;
        }

        if (nomeNormalizado.equals(RoleName.ROLE_ADMIN.name())) {
            throw new RuntimeException("Não é possível se autocadastrar com o perfil ADMIN.");
        }

        try {
            return RoleName.valueOf(nomeNormalizado);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Perfil informado é inválido: " + role);
        }
    }

    public LoginResponseDTO loginUser(LoginRequestDTO dto) {
        User user = userRepository.findByEmail(dto.email())
                .orElseThrow(() -> new RuntimeException("Credenciais inválidas"));

        if (!passwordEncoder.matches(dto.password(), user.getPassword())) {
            throw new RuntimeException("Credenciais inválidas");
        }

        String token = tokenService.generateToken(user);
        return new LoginResponseDTO(token, toUserResponseDTO(user));
    }
}
