package com.example.Back.Mapper;

import com.example.Back.Dto.ImagenHabitacionDTO;
import com.example.Back.Models.ImagenHabitacion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ImagenHabitacionMapper {
    @Mapping(source = "habitacion.idHabitacion", target = "idHabitacion")
    ImagenHabitacionDTO imagenHabitacionToImagenHabitacionDTO(ImagenHabitacion imagenHabitacion);

    List<ImagenHabitacionDTO> imagenesHabitacionToImagenesHabitacionDTOs(List<ImagenHabitacion> imagenesHabitacion);
}