package com.edustream.api.config;

import com.edustream.api.domain.model.Role;
import com.edustream.api.domain.model.RoleName;
import com.edustream.api.domain.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner{
    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
       if(roleRepository.count() == 0){
           Role perfilEstudante = new Role();
           perfilEstudante.setName(RoleName.ROLE_STUDENT);

           Role perfilInstrutor = new Role();
           perfilInstrutor.setName(RoleName.ROLE_INSTRUCTOR);

           Role perfilAdmin = new Role();
           perfilAdmin.setName(RoleName.ROLE_ADMIN);

           roleRepository.saveAll(List.of(perfilEstudante,perfilInstrutor,perfilAdmin));

           System.out.println("Seed inserida com sucesso: Roles populadas!");
       }
    }
}
