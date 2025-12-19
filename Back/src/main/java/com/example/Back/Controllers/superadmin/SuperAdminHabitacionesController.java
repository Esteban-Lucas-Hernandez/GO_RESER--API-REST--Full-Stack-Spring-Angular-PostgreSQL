package com.example.Back.Controllers.superadmin;

import com.example.Back.Dto.HabitacionDTO;
import com.example.Back.Services.SuperAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/superadmin/habitaciones")
public class SuperAdminHabitacionesController {

    private final SuperAdminService superAdminService;
    
    // Constructor
    public SuperAdminHabitacionesController(SuperAdminService superAdminService) {
        this.superAdminService = superAdminService;
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPERADMIN')")
    public ResponseEntity<List<HabitacionDTO>> listarHabitaciones() {
        return ResponseEntity.ok(superAdminService.listarHabitaciones());
    }

    @GetMapping("/hotel/{idHotel}")
    @PreAuthorize("hasRole('SUPERADMIN')")
    public ResponseEntity<List<HabitacionDTO>> listarHabitacionesPorHotel(@PathVariable Integer idHotel) {
        return ResponseEntity.ok(superAdminService.listarHabitacionesPorHotel(idHotel));
    }
}