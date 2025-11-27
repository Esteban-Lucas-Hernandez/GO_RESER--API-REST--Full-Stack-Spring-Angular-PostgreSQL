package com.example.Back.Controllers.admin;

import com.example.Back.Models.Hotel;
import com.example.Back.Dto.HotelDTO;
import com.example.Back.Services.HotelService;
import com.example.Back.Mapper.HotelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/admin/hoteles")
public class AdminHotelController {

    @Autowired
    private HotelService hotelService;
    
    @Autowired
    private HotelMapper hotelMapper;

    // Obtener todos los hoteles del administrador logueado
    @GetMapping
    public ResponseEntity<List<HotelDTO>> getAllHoteles() {
        List<HotelDTO> hoteles = hotelService.getHotelesByCurrentUser();
        return ResponseEntity.ok(hoteles);
    }

    // Crear un nuevo hotel
    @PostMapping
    public ResponseEntity<Hotel> createHotel(@RequestBody HotelDTO hotelDTO) {
        try {
            Hotel newHotel = hotelService.createHotel(hotelDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(newHotel);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Actualizar un hotel existente
    @PutMapping("/{id}")
    public ResponseEntity<Hotel> updateHotel(@PathVariable Integer id, @RequestBody HotelDTO hotelDTO) {
        Hotel updatedHotel = hotelService.updateHotel(id, hotelDTO);
        if (updatedHotel != null) {
            return ResponseEntity.ok(updatedHotel);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Verificar si un hotel tiene habitaciones asociadas
    @GetMapping("/{id}/has-habitaciones")
    public ResponseEntity<Boolean> hasHabitaciones(@PathVariable Integer id) {
        boolean hasHabitaciones = hotelService.hasHabitaciones(id);
        return ResponseEntity.ok(hasHabitaciones);
    }

    // Eliminar un hotel con todas sus dependencias (habitaciones, reservas, reseñas)
    @DeleteMapping("/{id}/cascade")
    public ResponseEntity<Map<String, Object>> deleteHotelWithCascade(@PathVariable Integer id) {
        boolean deleted = hotelService.deleteHotelWithCascade(id);
        Map<String, Object> response = new HashMap<>();
        
        if (deleted) {
            response.put("success", true);
            response.put("message", "Hotel y todas sus dependencias eliminadas exitosamente");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "No se encontró el hotel para eliminar");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}