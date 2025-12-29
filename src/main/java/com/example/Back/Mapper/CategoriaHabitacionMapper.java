package com.example.Back.Mapper;

import com.example.Back.Dto.CategoriaHabitacionDTO;
import com.example.Back.Models.CategoriaHabitacion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoriaHabitacionMapper {
    @Mapping(source = "usuario.idUsuario", target = "usuarioId")
    CategoriaHabitacionDTO categoriaHabitacionToCategoriaHabitacionDTO(CategoriaHabitacion categoria);
    
    @Mapping(source = "usuarioId", target = "usuario.idUsuario")
    CategoriaHabitacion categoriaHabitacionDTOToCategoriaHabitacion(CategoriaHabitacionDTO dto);
}