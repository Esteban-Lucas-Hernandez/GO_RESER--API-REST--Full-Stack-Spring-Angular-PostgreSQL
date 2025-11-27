package com.example.Back.Controllers.admin;

import com.example.Back.Dto.ImagenHabitacionDTO;
import com.example.Back.Services.ImagenHabitacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/hoteles/{hotelId}/habitaciones/{habitacionId}/imagenes")
public class AdminImagenHabitacionController {

    @Autowired
    private ImagenHabitacionService imagenHabitacionService;

    // Obtener todas las imágenes de una habitación
    @GetMapping
    public ResponseEntity<List<ImagenHabitacionDTO>> getImagenesByHabitacionId(
            @PathVariable Integer hotelId,
            @PathVariable Integer habitacionId) {
        List<ImagenHabitacionDTO> imagenes = imagenHabitacionService.getImagenesByHabitacionId(hotelId, habitacionId);
        return ResponseEntity.ok(imagenes);
    }

    // Crear una nueva imagen para una habitación
    @PostMapping
    public ResponseEntity<ImagenHabitacionDTO> createImagen(
            @PathVariable Integer hotelId,
            @PathVariable Integer habitacionId,
            @RequestBody ImagenHabitacionDTO imagenDTO) {
        ImagenHabitacionDTO createdImagen = imagenHabitacionService.createImagen(hotelId, habitacionId, imagenDTO);
        return ResponseEntity.ok(createdImagen);
    }

    // Eliminar una imagen de una habitación
    @DeleteMapping("/{imagenId}")
    public ResponseEntity<Void> deleteImagen(
            @PathVariable Integer hotelId,
            @PathVariable Integer habitacionId,
            @PathVariable Integer imagenId) {
        boolean deleted = imagenHabitacionService.deleteImagen(hotelId, habitacionId, imagenId);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}