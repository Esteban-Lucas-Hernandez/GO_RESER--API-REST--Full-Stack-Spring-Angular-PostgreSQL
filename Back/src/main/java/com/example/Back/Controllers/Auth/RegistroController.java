package com.example.Back.Controllers.Auth;

import com.example.Back.Dto.RegistroRequestDTO;
import com.example.Back.Services.RegistroService;

import lombok.RequiredArgsConstructor;
import java.util.Map;


import java.util.HashMap;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class RegistroController {

    private final RegistroService authService;

    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody RegistroRequestDTO request) {
    String mensaje = authService.registrar(request);
    Map<String, String> response = new HashMap<>();
    response.put("mensaje", mensaje);
    return ResponseEntity.ok(response);
}

}
