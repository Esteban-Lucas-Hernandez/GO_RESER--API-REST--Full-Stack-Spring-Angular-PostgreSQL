package com.example.Back.Controllers.Auth;

import com.example.Back.Dto.RegistroRequestDTO;
import com.example.Back.Services.RegistroService;

import java.util.Map;


import java.util.HashMap;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class RegistroController {

    private final RegistroService authService;
    
    // Constructor
    public RegistroController(RegistroService authService) {
        this.authService = authService;
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody RegistroRequestDTO request) {
    String mensaje = authService.registrar(request);
    Map<String, String> response = new HashMap<>();
    response.put("mensaje", mensaje);
    return ResponseEntity.ok(response);
}

}
