package com.example.Back.Services;

import com.example.Back.Models.Usuario;
import com.example.Back.Repo.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class SecurityService {
    private static final Logger logger = LoggerFactory.getLogger(SecurityService.class);

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        logger.info("Obteniendo usuario autenticado. Authentication: {}", authentication);
        
        if (authentication != null && authentication.isAuthenticated() && 
            !"anonymousUser".equals(authentication.getPrincipal())) {
            Object principal = authentication.getPrincipal();
            logger.info("Principal: {}", principal);
            
            if (principal instanceof UserDetails) {
                String email = ((UserDetails) principal).getUsername();
                logger.info("Buscando usuario por email: {}", email);
                return usuarioRepository.findByEmail(email).orElseGet(() -> {
                    logger.warn("Usuario no encontrado en la base de datos para email: {}", email);
                    return null;
                });
            } else if (principal instanceof String) {
                String email = (String) principal;
                logger.info("Buscando usuario por email (string): {}", email);
                return usuarioRepository.findByEmail(email).orElseGet(() -> {
                    logger.warn("Usuario no encontrado en la base de datos para email: {}", email);
                    return null;
                });
            }
        }
        logger.warn("No se encontró usuario autenticado válido");
        return null;
    }

    public Usuario getAuthenticatedUser() {
        Usuario usuario = getCurrentUser();
        if (usuario == null) {
            logger.error("Usuario no autenticado");
            throw new RuntimeException("Usuario no autenticado");
        }
        logger.info("Usuario autenticado: ID={}, Email={}", usuario.getIdUsuario(), usuario.getEmail());
        return usuario;
    }
}