package com.example.Back.Controllers.User;

import com.example.Back.Dto.ResenaDTO;
import com.example.Back.Services.ResenaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/user/resenas")
public class ResenaController {

    @Autowired
    private ResenaService resenaService;

    // Crear una nueva reseña
    @PostMapping("/hotel/{hotelId}")
    public ResponseEntity<?> crearResena(@PathVariable Integer hotelId,
                                         @RequestBody ResenaDTO resenaDTO) {
        try {
            ResenaDTO nuevaResena = resenaService.crearResena(resenaDTO, hotelId);
            // Crear una respuesta JSON estructurada
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Reseña creada exitosamente");
            response.put("data", nuevaResena);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Crear una respuesta JSON estructurada para errores
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("data", null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Actualizar una reseña existente
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarResena(@PathVariable Integer id,
                                              @RequestBody ResenaDTO resenaDTO) {
        try {
            ResenaDTO resenaActualizadaResult = resenaService.actualizarResena(id, resenaDTO);
            // Crear una respuesta JSON estructurada
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Reseña actualizada exitosamente");
            response.put("data", resenaActualizadaResult);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Crear una respuesta JSON estructurada para errores
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("data", null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Eliminar una reseña
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarResena(@PathVariable Integer id) {
        try {
            resenaService.eliminarResena(id);
            // Crear una respuesta JSON estructurada
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Reseña eliminada exitosamente");
            response.put("data", null);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Crear una respuesta JSON estructurada para errores
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("data", null);
            return ResponseEntity.badRequest().body(response);
        }
    }
}