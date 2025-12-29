package com.example.Back.Controllers.admin;

import com.example.Back.Dto.CiudadDTO;
import com.example.Back.Dto.DepartamentoDTO;
import com.example.Back.Mapper.DepartamentoMapper;
import com.example.Back.Models.Ciudad;
import com.example.Back.Models.Departamento;
import com.example.Back.Repo.CiudadRepository;
import com.example.Back.Repo.DepartamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin/departamentos")
public class AdminDepartamentoController {

    @Autowired
    private DepartamentoRepository departamentoRepository;

    @Autowired
    private CiudadRepository ciudadRepository;
    
    @Autowired
    private DepartamentoMapper departamentoMapper;

    // Obtener lista de departamentos
    @GetMapping
    public ResponseEntity<List<DepartamentoDTO>> getAllDepartamentos() {
        List<Departamento> departamentos = departamentoRepository.findAll();
        List<DepartamentoDTO> departamentoDTOs = departamentoMapper.departamentosToDepartamentoDTOs(departamentos);
        return ResponseEntity.ok(departamentoDTOs);
    }

    // Obtener ciudades de un departamento específico
    @GetMapping("/{id}/ciudades")
    public ResponseEntity<List<CiudadDTO>> getCiudadesByDepartamento(@PathVariable Integer id) {
        Optional<Departamento> departamento = departamentoRepository.findById(id);
        if (departamento.isPresent()) {
            List<Ciudad> ciudades = ciudadRepository.findByDepartamento(departamento.get());
            List<CiudadDTO> ciudadDTOs = departamentoMapper.ciudadesToCiudadDTOs(ciudades);
            return ResponseEntity.ok(ciudadDTOs);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}