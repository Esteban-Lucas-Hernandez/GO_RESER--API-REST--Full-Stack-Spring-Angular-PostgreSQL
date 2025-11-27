package com.example.Back.Services;

import com.example.Back.Dto.RegistroRequestDTO;
import com.example.Back.Models.Role;
import com.example.Back.Models.Usuario;
import com.example.Back.Repo.RoleRepository;
import com.example.Back.Repo.UsuarioRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class RegistroService {

    private final UsuarioRepository usuarioRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public String registrar(RegistroRequestDTO request) {

        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            return "El email ya está registrado";
        }

        // Obtener el rol user
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("ROLE_USER no existe"));

        Usuario nuevo = Usuario.builder()
                .nombreCompleto(request.getNombreCompleto())
                .email(request.getEmail())
                .telefono(request.getTelefono())
                .documento(request.getDocumento())
                .fotoUrl(request.getFotoUrl()) // Agregar la URL de la foto
                .contrasena(passwordEncoder.encode(request.getContrasena()))
                .roles(Set.of(userRole))      // ASIGNA ROLE_USER
                .build();

        usuarioRepository.save(nuevo);

        return "Usuario registrado correctamente";
    }
}