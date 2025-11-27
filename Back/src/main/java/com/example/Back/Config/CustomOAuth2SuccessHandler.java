package com.example.Back.Config;

import com.example.Back.Dto.GoogleLoginResponseDTO;
import com.example.Back.Models.Role;
import com.example.Back.Models.Usuario;
import com.example.Back.Repo.RoleRepository;
import com.example.Back.Repo.UsuarioRepository;
import com.example.Back.Security.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;
import java.util.Set;
import java.util.HashSet;

@Component
public class CustomOAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RoleRepository roleRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        
        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2User oauth2User = ((OAuth2AuthenticationToken) authentication).getPrincipal();
            
            // Obtener información del usuario de Google
            String email = oauth2User.getAttribute("email");
            String fullName = oauth2User.getAttribute("name");
            String pictureUrl = oauth2User.getAttribute("picture"); // URL de la foto de perfil
            
            // Verificar si el usuario ya existe en nuestra base de datos
            Optional<Usuario> existingUser = usuarioRepository.findByEmail(email);
            
            Usuario user;
            if (existingUser.isPresent()) {
                user = existingUser.get();
                // Verificar que el usuario esté activo
                if (!user.getEstado()) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Usuario inactivo");
                    return;
                }
                
                // Actualizar la URL de la foto si es diferente o está vacía
                if ((user.getFotoUrl() == null || user.getFotoUrl().isEmpty()) && pictureUrl != null) {
                    user.setFotoUrl(pictureUrl);
                    user = usuarioRepository.save(user);
                }
            } else {
                // Crear nuevo usuario si no existe
                user = new Usuario();
                user.setEmail(email);
                user.setNombreCompleto(fullName != null ? fullName : email);
                user.setContrasena(""); // No se usará contraseña para usuarios de Google
                user.setEstado(true);
                user.setFotoUrl(pictureUrl); // Guardar la URL de la foto de perfil
                
                // Asignar rol USER por defecto
                Role userRole = roleRepository.findByName("ROLE_USER")
                        .orElseGet(() -> roleRepository.save(new Role(null, "ROLE_USER")));
                
                Set<Role> roles = new HashSet<>();
                roles.add(userRole);
                user.setRoles(roles);
                
                // Guardar el nuevo usuario
                user = usuarioRepository.save(user);
            }
            
            // Para usuarios existentes, asegurarse de que tengan al menos un rol
            if (user.getRoles() == null || user.getRoles().isEmpty()) {
                Role userRole = roleRepository.findByName("ROLE_USER")
                        .orElseGet(() -> roleRepository.save(new Role(null, "ROLE_USER")));
                
                Set<Role> roles = user.getRoles() != null ? user.getRoles() : new HashSet<>();
                roles.add(userRole);
                user.setRoles(roles);
                
                // Actualizar el usuario con el rol asignado
                user = usuarioRepository.save(user);
            }
            
            // Generar token JWT
            String token = jwtUtil.generateToken(user);
            
            // Redirigir al frontend con el token como parámetro
            String redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:4200/auth/google/callback")
                    .queryParam("token", token)
                    .queryParam("userId", user.getIdUsuario())
                    .queryParam("email", user.getEmail())
                    .queryParam("fullName", user.getNombreCompleto())
                    .queryParam("fotoUrl", user.getFotoUrl()) // Incluir la URL de la foto
                    .queryParam("success", true)
                    .toUriString();
            
            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
        } else {
            super.onAuthenticationSuccess(request, response, authentication);
        }
    }
}