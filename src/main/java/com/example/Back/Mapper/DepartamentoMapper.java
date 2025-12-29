package com.example.Back.Mapper;

import com.example.Back.Dto.CiudadDTO;
import com.example.Back.Dto.DepartamentoDTO;
import com.example.Back.Models.Ciudad;
import com.example.Back.Models.Departamento;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class DepartamentoMapper {

    public DepartamentoDTO departamentoToDepartamentoDTO(Departamento departamento) {
        if (departamento == null) {
            return null;
        }
        
        DepartamentoDTO dto = new DepartamentoDTO();
        dto.setId(departamento.getId());
        dto.setNombre(departamento.getNombre());
        
        return dto;
    }

    public List<DepartamentoDTO> departamentosToDepartamentoDTOs(List<Departamento> departamentos) {
        return departamentos.stream()
                .map(this::departamentoToDepartamentoDTO)
                .collect(Collectors.toList());
    }

    public CiudadDTO ciudadToCiudadDTO(Ciudad ciudad) {
        if (ciudad == null) {
            return null;
        }
        
        CiudadDTO dto = new CiudadDTO();
        dto.setId(ciudad.getId());
        dto.setNombre(ciudad.getNombre());
        dto.setLatitud(ciudad.getLatitud());
        dto.setLongitud(ciudad.getLongitud());
        
        if (ciudad.getDepartamento() != null) {
            dto.setDepartamentoId(ciudad.getDepartamento().getId());
            dto.setDepartamentoNombre(ciudad.getDepartamento().getNombre());
        }
        
        return dto;
    }

    public List<CiudadDTO> ciudadesToCiudadDTOs(List<Ciudad> ciudades) {
        return ciudades.stream()
                .map(this::ciudadToCiudadDTO)
                .collect(Collectors.toList());
    }
}