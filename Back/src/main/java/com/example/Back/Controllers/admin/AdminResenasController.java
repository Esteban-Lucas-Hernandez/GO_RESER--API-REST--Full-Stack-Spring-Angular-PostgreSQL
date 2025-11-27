package com.example.Back.Controllers.admin;

import com.example.Back.Dto.ResenaDTO;
import com.example.Back.Services.ResenaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/resenas")
public class AdminResenasController {

    @Autowired
    private ResenaService resenaService;

    /**
     * Obtener todas las reseñas de todos los hoteles del usuario actual
     */
    @GetMapping
    public ResponseEntity<List<ResenaDTO>> getResenasDeMisHoteles() {
        try {
            List<ResenaDTO> resenas = resenaService.getResenasDeMisHoteles();
            return ResponseEntity.ok(resenas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Obtener todas las reseñas de un hotel específico del usuario actual
     */
    @GetMapping("/hotel/{idHotel}")
    public ResponseEntity<List<ResenaDTO>> getResenasPorHotel(@PathVariable Integer idHotel) {
        try {
            List<ResenaDTO> resenas = resenaService.getResenasPorHotelDeUsuario(idHotel);
            return ResponseEntity.ok(resenas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}