package com.example.Back.Config;

import com.example.Back.Models.Role;
import com.example.Back.Models.Usuario;
import com.example.Back.Repo.RoleRepository;
import com.example.Back.Repo.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final RoleRepository roleRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {

            // Crear roles si no existen
            Role roleUser = roleRepository.findByName("ROLE_USER")
                    .orElseGet(() -> roleRepository.save(new Role(null, "ROLE_USER")));

            Role roleAdmin = roleRepository.findByName("ROLE_ADMIN")
                    .orElseGet(() -> roleRepository.save(new Role(null, "ROLE_ADMIN")));

            Role roleSuperAdmin = roleRepository.findByName("ROLE_SUPERADMIN")
                    .orElseGet(() -> roleRepository.save(new Role(null, "ROLE_SUPERADMIN")));

            // Crear admin por defecto
            if (usuarioRepository.findByEmail("admin@admin.com").isEmpty()) {

                Usuario admin = Usuario.builder()
                        .nombreCompleto("Administrador Principal")
                        .email("admin@admin.com")
                        .telefono("0000000000")
                        .documento("ADMIN000")
                        .contrasena(passwordEncoder.encode("admin123"))
                        .roles(Set.of(roleAdmin))
                        .build();

                usuarioRepository.save(admin);

                System.out.println("✅ ADMIN creado: admin@admin.com / admin123");
            }
            
            // Crear superadmin por defecto
            if (usuarioRepository.findByEmail("superadmin@admin.com").isEmpty()) {

                Usuario superAdmin = Usuario.builder()
                        .nombreCompleto("Super Administrador")
                        .email("superadmin@admin.com")
                        .telefono("0000000001")
                        .documento("SUPERADMIN001")
                        .contrasena(passwordEncoder.encode("superadmin123"))
                        .roles(Set.of(roleSuperAdmin))
                        .build();

                usuarioRepository.save(superAdmin);

                System.out.println("✅ SUPERADMIN creado: superadmin@admin.com / superadmin123");
            }
        };
    }
}
