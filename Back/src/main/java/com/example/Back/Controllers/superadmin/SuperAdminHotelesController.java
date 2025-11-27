package com.example.Back.Controllers.superadmin;

import com.example.Back.Dto.HotelDTO;
import com.example.Back.Services.SuperAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/superadmin/hoteles")
@RequiredArgsConstructor
public class SuperAdminHotelesController {

    private final SuperAdminService superAdminService;

    @GetMapping
    @PreAuthorize("hasRole('SUPERADMIN')")
    public ResponseEntity<List<HotelDTO>> listarHoteles() {
        return ResponseEntity.ok(superAdminService.listarHoteles());
    }

}