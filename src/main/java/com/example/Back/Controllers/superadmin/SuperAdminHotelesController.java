package com.example.Back.Controllers.superadmin;

import com.example.Back.Dto.HotelDTO;
import com.example.Back.Services.SuperAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/superadmin/hoteles")
public class SuperAdminHotelesController {

    private final SuperAdminService superAdminService;
    
    // Constructor
    public SuperAdminHotelesController(SuperAdminService superAdminService) {
        this.superAdminService = superAdminService;
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPERADMIN')")
    public ResponseEntity<List<HotelDTO>> listarHoteles() {
        return ResponseEntity.ok(superAdminService.listarHoteles());
    }

}