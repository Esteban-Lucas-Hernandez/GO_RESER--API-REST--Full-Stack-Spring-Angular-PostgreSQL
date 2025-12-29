package com.example.Back.Controllers.admin;

import com.example.Back.Dto.CrearHabitacionDTO;
import com.example.Back.Dto.HabitacionDTO;
import com.example.Back.Services.HabitacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin/hoteles/{hotelId}/habitaciones")
public class AdminHabitacionController {

    @Autowired
    private HabitacionService habitacionService;

    // Obtener todas las habitaciones de un hotel
    @GetMapping
    public ResponseEntity<List<HabitacionDTO>> getHabitacionesByHotelId(@PathVariable Integer hotelId) {
        List<HabitacionDTO> habitaciones = habitacionService.getHabitacionesByHotelId(hotelId);
        return ResponseEntity.ok(habitaciones);
    }

    // Obtener una habitación específica
    @GetMapping("/{habitacionId}")
    public ResponseEntity<HabitacionDTO> getHabitacionById(
            @PathVariable Integer hotelId,
            @PathVariable Integer habitacionId) {
        Optional<HabitacionDTO> habitacion = habitacionService.getHabitacionByIdAndHotelId(habitacionId, hotelId);
        return habitacion.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Crear una nueva habitación
    @PostMapping
    public ResponseEntity<?> createHabitacion(
            @PathVariable Integer hotelId,
            @RequestBody CrearHabitacionDTO crearHabitacionDTO) {
        try {
            Optional<HabitacionDTO> createdHabitacion = habitacionService.createHabitacionDesdeDTO(hotelId, crearHabitacionDTO);
            return createdHabitacion.map(dto -> ResponseEntity.ok(dto))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear habitación: " + e.getMessage());
        }
    }

    // Actualizar una habitación
    @PutMapping("/{habitacionId}")
    public ResponseEntity<HabitacionDTO> updateHabitacion(
            @PathVariable Integer hotelId,
            @PathVariable Integer habitacionId,
            @RequestBody HabitacionDTO habitacionDTO) {
        Optional<HabitacionDTO> updatedHabitacion = habitacionService.updateHabitacion(habitacionId, hotelId, habitacionDTO);
        return updatedHabitacion.map(dto -> ResponseEntity.ok(dto))
                .orElse(ResponseEntity.notFound().build());
    }

    // Eliminar una habitación
    @DeleteMapping("/{habitacionId}")
    public ResponseEntity<Void> deleteHabitacion(
            @PathVariable Integer hotelId,
            @PathVariable Integer habitacionId) {
        boolean deleted = habitacionService.deleteHabitacion(habitacionId, hotelId);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}