package com.example.Back.Services;

import com.example.Back.Dto.GoogleLoginResponseDTO;
import com.example.Back.Models.Role;
import com.example.Back.Models.Usuario;
import com.example.Back.Repo.RoleRepository;
import com.example.Back.Repo.UsuarioRepository;
import com.example.Back.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;
import java.util.Set;
import java.util.HashSet;

@Service
public class GoogleLoginService {

    private static final Logger logger = LoggerFactory.getLogger(GoogleLoginService.class);

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Procesa el inicio de sesión con Google y devuelve un token JWT
     *
     * @param authentication Token de autenticación OAuth2 de Google
     * @return Respuesta con token JWT y datos del usuario
     */
    public GoogleLoginResponseDTO processGoogleLogin(OAuth2AuthenticationToken authentication) {
        try {
            OAuth2User oauth2User = authentication.getPrincipal();
            
            // Obtener información del usuario de Google
            String email = oauth2User.getAttribute("email");
            String fullName = oauth2User.getAttribute("name");
            String googleId = oauth2User.getAttribute("sub");
            String pictureUrl = oauth2User.getAttribute("picture"); // URL de la foto de perfil
            
            logger.info("Inicio de sesión con Google para el usuario: {}", email);
            
            // Verificar si el usuario ya existe en nuestra base de datos
            Optional<Usuario> existingUser = usuarioRepository.findByEmail(email);
            
            Usuario user;
            if (existingUser.isPresent()) {
                user = existingUser.get();
                logger.info("Usuario existente encontrado: {}", user.getEmail());
                
                // Verificar que el usuario esté activo
                if (!user.getEstado()) {
                    return new GoogleLoginResponseDTO(false, "Usuario inactivo", null, null, null, null, null);
                }
                
                // Actualizar la URL de la foto si es diferente o está vacía
                if ((user.getFotoUrl() == null || user.getFotoUrl().isEmpty()) && pictureUrl != null) {
                    user.setFotoUrl(pictureUrl);
                    user = usuarioRepository.save(user);
                }
            } else {
                // Crear nuevo usuario si no existe
                logger.info("Creando nuevo usuario para: {}", email);
                user = new Usuario();
                user.setEmail(email);
                user.setNombreCompleto(fullName != null ? fullName : email);
                user.setContrasena(""); // No se usará contraseña para usuarios de Google
                user.setEstado(true);
                user.setFotoUrl(pictureUrl); // Guardar la URL de la foto de perfil
                
                // Asignar rol USER por defecto
                Role userRole = roleRepository.findByName("ROLE_USER")
                        .orElseGet(() -> {
                            logger.warn("Rol ROLE_USER no encontrado, creando rol por defecto");
                            return roleRepository.save(new Role(null, "ROLE_USER"));
                        });
                
                Set<Role> roles = new HashSet<>();
                roles.add(userRole);
                user.setRoles(roles);
                
                // Guardar el nuevo usuario
                user = usuarioRepository.save(user);
            }
            
            // Para usuarios existentes, asegurarse de que tengan al menos un rol
            if (user.getRoles() == null || user.getRoles().isEmpty()) {
                logger.warn("Usuario {} no tiene roles asignados, asignando rol USER por defecto", email);
                Role userRole = roleRepository.findByName("ROLE_USER")
                        .orElseGet(() -> {
                            logger.warn("Rol ROLE_USER no encontrado, creando rol por defecto");
                            return roleRepository.save(new Role(null, "ROLE_USER"));
                        });
                
                Set<Role> roles = user.getRoles() != null ? user.getRoles() : new HashSet<>();
                roles.add(userRole);
                user.setRoles(roles);
                
                // Actualizar el usuario con el rol asignado
                user = usuarioRepository.save(user);
            }
            
            // Generar token JWT
            String token = jwtUtil.generateToken(user);
            
            if (token == null || token.isEmpty()) {
                return new GoogleLoginResponseDTO(false, "Error al generar el token de autenticación", null, null, null, null, null);
            }
            
            return new GoogleLoginResponseDTO(
                true,
                "Autenticación con Google exitosa",
                token,
                user.getIdUsuario(),
                user.getNombreCompleto(),
                user.getEmail(),
                user.getFotoUrl() // Incluir la URL de la foto en la respuesta
            );
        } catch (Exception e) {
            logger.error("Error durante el inicio de sesión con Google: ", e);
            return new GoogleLoginResponseDTO(false, "Error en el proceso de autenticación con Google: " + e.getMessage(), null, null, null, null, null);
        }
    }
}