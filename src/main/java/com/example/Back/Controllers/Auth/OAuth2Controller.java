package com.example.Back.Controllers.Auth;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OAuth2Controller {

    @GetMapping("/oauth2/authorization/google")
    public String redirectToGoogle() {
        // Esta ruta será manejada automáticamente por Spring Security OAuth2
        // No necesitamos implementar nada aquí
        return "redirect:/oauth2/authorization/google";
    }
}