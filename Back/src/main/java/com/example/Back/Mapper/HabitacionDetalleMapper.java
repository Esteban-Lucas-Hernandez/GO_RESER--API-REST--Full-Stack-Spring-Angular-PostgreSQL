package com.example.Back.Mapper;

import com.example.Back.Dto.HabitacionDetalleDTO;
import com.example.Back.Models.Habitacion;
import com.example.Back.Models.ImagenHabitacion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {CategoriaHabitacionMapper.class})
public interface HabitacionDetalleMapper {
    @Mapping(source = "hotel.id", target = "idHotel")
    @Mapping(source = "categoria", target = "categoria")
    @Mapping(source = "estado", target = "estado")
    @Mapping(source = "imagenes", target = "imagenesUrls", qualifiedByName = "imagenesUrls")
    HabitacionDetalleDTO habitacionToHabitacionDetalleDTO(Habitacion habitacion);

    @Named("imagenesUrls")
    default List<String> imagenesUrls(List<com.example.Back.Models.ImagenHabitacion> imagenes) {
        if (imagenes != null) {
            return imagenes.stream()
                    .map(com.example.Back.Models.ImagenHabitacion::getUrlImagen)
                    .collect(Collectors.toList());
        }
        return List.of();
    }
}