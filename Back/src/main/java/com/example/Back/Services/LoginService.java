package com.example.Back.Services;

import com.example.Back.Dto.LoginResponseDTO;
import com.example.Back.Models.Usuario;
import com.example.Back.Repo.UsuarioRepository;
import com.example.Back.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // Método para login: valida contraseña y devuelve JWT
    public LoginResponseDTO login(String email, String password) {
        try {
            Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            if (!usuario.getEstado()) {
                return new LoginResponseDTO(false, "Usuario inactivo", null, null, null, null);
            }

            if (!passwordEncoder.matches(password, usuario.getContrasena())) {
                return new LoginResponseDTO(false, "Contraseña incorrecta", null, null, null, null);
            }

            String token = jwtUtil.generateToken(usuario);
            
            // Validar que el token se haya generado correctamente
            if (token == null || token.isEmpty()) {
                return new LoginResponseDTO(false, "Error al generar el token de autenticación", null, null, null, null);
            }
            
            return new LoginResponseDTO(
                true, 
                "Autenticación exitosa", 
                token, 
                usuario.getIdUsuario(), 
                usuario.getNombreCompleto(), 
                usuario.getEmail()
            );
        } catch (Exception e) {
            return new LoginResponseDTO(false, "Error en el proceso de autenticación: " + e.getMessage(), null, null, null, null);
        }
    }
}