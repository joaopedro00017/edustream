package com.edustream.api.service;

import com.edustream.api.domain.model.Role;
import com.edustream.api.domain.model.RoleName;
import com.edustream.api.domain.model.User;
import com.edustream.api.domain.repository.RoleRepository;
import com.edustream.api.domain.repository.UserRepository;
import com.edustream.api.dto.UserRegisterDTO;
import com.edustream.api.dto.UserResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Transactional
    public UserResponseDTO registerUser(UserRegisterDTO dto){
        if (userRepository.findByEmail(dto.email()).isPresent()){
            throw new RuntimeException("E-mail já cadastrado no sistema!");
        }

        Role studentRole = roleRepository.findByName(RoleName.ROLE_STUDENT)
                .orElseThrow(()-> new RuntimeException("Perfil padrão ROLE_STUDENT não encontrado no banco de dados!"));

        User user = new User();
        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setPassword(dto.password());
        user.getRoles().add(studentRole);
        User savedUser = userRepository.save(user);

        Set<RoleName> roleNames = savedUser.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return new UserResponseDTO(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                roleNames
        );
    }
}
