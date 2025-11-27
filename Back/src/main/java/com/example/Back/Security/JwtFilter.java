package com.example.Back.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                HttpServletResponse response,
                                FilterChain filterChain)
        throws ServletException, IOException {
        
        String uri = request.getRequestURI();
        String method = request.getMethod();
        logger.info("Procesando solicitud: {} {}", method, uri);

        // Rutas públicas - permitir el acceso sin autenticación
        if (uri.startsWith("/auth/") || uri.startsWith("/public/") || 
            uri.startsWith("/v3/api-docs") || uri.startsWith("/swagger-ui") ||
            uri.startsWith("/swagger-resources") || uri.startsWith("/webjars/")) {
            logger.info("Ruta pública, permitiendo acceso sin autenticación: {}", uri);
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        logger.info("Encabezado de autorización: {}", authHeader);

        String email = null;
        String jwt = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            logger.info("Token JWT extraído");

            try {
                email = jwtUtil.extractUsername(jwt);
                logger.info("Email extraído del token: {}", email);
            } catch (Exception e) {
                logger.error("Error al extraer email del token", e);
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token inválido");
                return;
            }
        } else {
            logger.warn("No se proporcionó token de autenticación para la ruta protegida: {}", uri);
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Se requiere autenticación");
            return;
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            logger.info("Validando token para el usuario: {}", email);

            try {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(email);
                logger.info("Usuario cargado de la base de datos: {}", userDetails.getUsername());
                logger.info("Roles del usuario: {}", userDetails.getAuthorities());

                if (jwtUtil.validateToken(jwt, userDetails)) {
                    logger.info("Token válido para el usuario: {}", email);
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities()
                            );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    logger.info("Autenticación establecida en el contexto de seguridad");
                } else {
                    logger.warn("Token inválido para el usuario: {}", email);
                    response.sendError(HttpServletResponse.SC_FORBIDDEN, "Token inválido o expirado");
                    return;
                }
            } catch (Exception e) {
                logger.error("Error al validar token para el usuario: {}", email, e);
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Error de autenticación");
                return;
            }
        } else if (email == null) {
            logger.warn("No se pudo extraer el email del token");
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token inválido");
            return;
        }

        logger.info("Continuando con la cadena de filtros");
        filterChain.doFilter(request, response);
    }
}