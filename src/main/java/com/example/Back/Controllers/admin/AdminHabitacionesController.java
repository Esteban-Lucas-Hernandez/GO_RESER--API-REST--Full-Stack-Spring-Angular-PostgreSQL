package com.example.Back.Controllers.admin;

import com.example.Back.Dto.HabitacionDTO;
import com.example.Back.Services.HabitacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/hoteles/habitaciones")
public class AdminHabitacionesController {

    @Autowired
    private HabitacionService habitacionService;

    /**
     * Obtener todas las habitaciones de todos los hoteles del usuario actual
     */
    @GetMapping
    public ResponseEntity<List<HabitacionDTO>> getHabitacionesDeMisHoteles() {
        try {
            List<HabitacionDTO> habitaciones = habitacionService.getHabitacionesDeMisHoteles();
            return ResponseEntity.ok(habitaciones);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}