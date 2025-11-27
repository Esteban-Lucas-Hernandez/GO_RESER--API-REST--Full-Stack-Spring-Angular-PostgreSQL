package com.example.Back.Controllers.admin;

import com.example.Back.Dto.CategoriaHabitacionDTO;
import com.example.Back.Services.CategoriaHabitacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin/categoria")
public class AdminCategoriaHabitacionController {

    @Autowired
    private CategoriaHabitacionService categoriaHabitacionService;

    @GetMapping
    public ResponseEntity<List<CategoriaHabitacionDTO>> obtenerCategoriasPorUsuario() {
        List<CategoriaHabitacionDTO> categorias = categoriaHabitacionService.obtenerCategoriasPorUsuario();
        return ResponseEntity.ok(categorias);
    }

    @GetMapping("/{categoriaId}")
    public ResponseEntity<CategoriaHabitacionDTO> obtenerCategoriaPorId(@PathVariable Integer categoriaId) {
        Optional<CategoriaHabitacionDTO> categoria = categoriaHabitacionService.obtenerCategoriaPorId(categoriaId);
        return categoria.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CategoriaHabitacionDTO> crearCategoriaParaUsuario(
            @RequestBody CategoriaHabitacionDTO categoriaDTO) {
        CategoriaHabitacionDTO categoriaCreada = categoriaHabitacionService.crearCategoriaParaUsuario(categoriaDTO);
        return ResponseEntity.ok(categoriaCreada);
    }

    @PutMapping("/{categoriaId}")
    public ResponseEntity<CategoriaHabitacionDTO> actualizarCategoriaDeUsuario(
            @PathVariable Integer categoriaId,
            @RequestBody CategoriaHabitacionDTO categoriaDTO) {
        CategoriaHabitacionDTO categoriaActualizada = categoriaHabitacionService.actualizarCategoriaDeUsuario(categoriaId, categoriaDTO);
        return ResponseEntity.ok(categoriaActualizada);
    }

    @DeleteMapping("/{categoriaId}")
    public ResponseEntity<Void> eliminarCategoriaDeUsuario(
            @PathVariable Integer categoriaId) {
        categoriaHabitacionService.eliminarCategoriaDeUsuario(categoriaId);
        return ResponseEntity.noContent().build();
    }
}