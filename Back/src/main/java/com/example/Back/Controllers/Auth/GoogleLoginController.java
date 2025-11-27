package com.example.Back.Controllers.Auth;

import com.example.Back.Dto.GoogleLoginResponseDTO;
import com.example.Back.Services.GoogleLoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@RequestMapping("/auth/google")
public class GoogleLoginController {

    @Autowired
    private GoogleLoginService googleLoginService;

    /**
     * Endpoint para iniciar sesión con Google
     *
     * @param authentication Token de autenticación OAuth2 de Google
     * @return Respuesta con token JWT y datos del usuario
     */
    @GetMapping("/login")
    public ResponseEntity<GoogleLoginResponseDTO> googleLogin(
            @AuthenticationPrincipal OAuth2AuthenticationToken authentication) {
        
        // Verificar que la autenticación sea válida
        if (authentication == null) {
            GoogleLoginResponseDTO response = new GoogleLoginResponseDTO();
            response.setSuccess(false);
            response.setMessage("Autenticación con Google fallida - No se recibió autenticación");
            return ResponseEntity.badRequest().body(response);
        }

        // Procesar el inicio de sesión con Google
        GoogleLoginResponseDTO response = googleLoginService.processGoogleLogin(authentication);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Endpoint alternativo para iniciar sesión con Google (POST)
     *
     * @param authentication Token de autenticación OAuth2 de Google
     * @return Respuesta con token JWT y datos del usuario
     */
    @PostMapping("/login")
    public ResponseEntity<GoogleLoginResponseDTO> googleLoginPost(
            @AuthenticationPrincipal OAuth2AuthenticationToken authentication) {
        
        // Verificar que la autenticación sea válida
        if (authentication == null) {
            GoogleLoginResponseDTO response = new GoogleLoginResponseDTO();
            response.setSuccess(false);
            response.setMessage("Autenticación con Google fallida - No se recibió autenticación");
            return ResponseEntity.badRequest().body(response);
        }

        // Procesar el inicio de sesión con Google
        GoogleLoginResponseDTO response = googleLoginService.processGoogleLogin(authentication);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Endpoint para manejar el éxito del inicio de sesión con Google
     *
     * @param authentication Token de autenticación OAuth2 de Google
     * @return Respuesta con token JWT y datos del usuario
     */
    @GetMapping("/success")
    public ResponseEntity<GoogleLoginResponseDTO> googleLoginSuccess(
            OAuth2AuthenticationToken authentication) {
        
        // Verificar que la autenticación sea válida
        if (authentication == null) {
            GoogleLoginResponseDTO response = new GoogleLoginResponseDTO();
            response.setSuccess(false);
            response.setMessage("Autenticación con Google fallida - No se recibió autenticación en success");
            return ResponseEntity.badRequest().body(response);
        }

        // Procesar el inicio de sesión con Google
        GoogleLoginResponseDTO response = googleLoginService.processGoogleLogin(authentication);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Endpoint para manejar el fallo del inicio de sesión con Google
     *
     * @return Mensaje de error
     */
    @GetMapping("/failure")
    public ResponseEntity<GoogleLoginResponseDTO> googleLoginFailure() {
        GoogleLoginResponseDTO response = new GoogleLoginResponseDTO();
        response.setSuccess(false);
        response.setMessage("Falló la autenticación con Google");
        return ResponseEntity.status(401).body(response);
    }
}