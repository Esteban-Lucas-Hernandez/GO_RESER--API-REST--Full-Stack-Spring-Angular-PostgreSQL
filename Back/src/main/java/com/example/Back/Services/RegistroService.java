package com.example.Back.Services;

import com.example.Back.Dto.RegistroRequestDTO;
import com.example.Back.Models.Role;
import com.example.Back.Models.Usuario;
import com.example.Back.Repo.RoleRepository;
import com.example.Back.Repo.UsuarioRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class RegistroService {

    private final UsuarioRepository usuarioRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    
    // Constructor
    public RegistroService(UsuarioRepository usuarioRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String registrar(RegistroRequestDTO request) {

        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            return "El email ya está registrado";
        }

        // Obtener el rol user
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("ROLE_USER no existe"));

        Usuario nuevo = new Usuario();
        nuevo.setNombreCompleto(request.getNombreCompleto());
        nuevo.setEmail(request.getEmail());
        nuevo.setTelefono(request.getTelefono());
        nuevo.setDocumento(request.getDocumento());
        nuevo.setFotoUrl(request.getFotoUrl()); // Agregar la URL de la foto
        nuevo.setContrasena(passwordEncoder.encode(request.getContrasena()));
        nuevo.setRoles(Set.of(userRole));      // ASIGNA ROLE_USER

        usuarioRepository.save(nuevo);

        return "Usuario registrado correctamente";
    }
}