package com.example.Back.Config;

import com.example.Back.Models.Role;
import com.example.Back.Models.Usuario;
import com.example.Back.Repo.RoleRepository;
import com.example.Back.Repo.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
public class DataInitializer {

    private final RoleRepository roleRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    
    // Constructor
    public DataInitializer(RoleRepository roleRepository, UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

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

                Usuario admin = new Usuario();
                admin.setNombreCompleto("Administrador Principal");
                admin.setEmail("admin@admin.com");
                admin.setTelefono("0000000000");
                admin.setDocumento("ADMIN000");
                admin.setContrasena(passwordEncoder.encode("admin123"));
                admin.setRoles(Set.of(roleAdmin));

                usuarioRepository.save(admin);

                System.out.println("✅ ADMIN creado: admin@admin.com / admin123");
            }
            
            // Crear superadmin por defecto
            if (usuarioRepository.findByEmail("superadmin@admin.com").isEmpty()) {

                Usuario superAdmin = new Usuario();
                superAdmin.setNombreCompleto("Super Administrador");
                superAdmin.setEmail("superadmin@admin.com");
                superAdmin.setTelefono("0000000001");
                superAdmin.setDocumento("SUPERADMIN001");
                superAdmin.setContrasena(passwordEncoder.encode("superadmin123"));
                superAdmin.setRoles(Set.of(roleSuperAdmin));

                usuarioRepository.save(superAdmin);

                System.out.println("✅ SUPERADMIN creado: superadmin@admin.com / superadmin123");
            }
        };
    }
}
