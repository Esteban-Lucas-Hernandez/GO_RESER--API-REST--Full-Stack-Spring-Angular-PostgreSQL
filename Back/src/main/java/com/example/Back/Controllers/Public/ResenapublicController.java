package com.example.Back.Controllers.Public;

import com.example.Back.Dto.ResenaDTO;
import com.example.Back.Services.ResenaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/public/resenas")
public class ResenaPublicController {

    @Autowired
    private ResenaService resenaService;

    // Obtener todas las reseñas de un hotel específico (endpoint público)
    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<ResenaDTO>> obtenerResenasPorHotel(@PathVariable Integer hotelId) {
        try {
            List<ResenaDTO> resenas = resenaService.obtenerResenasPorHotel(hotelId);
            return ResponseEntity.ok(resenas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Obtener todas las reseñas de todos los hoteles (endpoint público)
    @GetMapping
    public ResponseEntity<List<ResenaDTO>> obtenerTodasLasResenas() {
        try {
            List<ResenaDTO> resenas = resenaService.obtenerTodasLasResenas();
            return ResponseEntity.ok(resenas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}