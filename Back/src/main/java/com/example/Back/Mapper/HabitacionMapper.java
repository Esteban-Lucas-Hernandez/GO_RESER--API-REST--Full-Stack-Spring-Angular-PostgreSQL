package com.example.Back.Mapper;

import com.example.Back.Dto.HabitacionDTO;
import com.example.Back.Models.Habitacion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {CategoriaHabitacionMapper.class})
public interface HabitacionMapper {
    @Mapping(source = "hotel.id", target = "idHotel")
    @Mapping(source = "categoria", target = "categoria")
    @Mapping(source = "estado", target = "estado")
    @Mapping(source = "imagenes", target = "imagenUrl", qualifiedByName = "firstImageUrl")
    @Mapping(source = "imagenes", target = "imagenesUrls", qualifiedByName = "allImageUrls")
    @Mapping(source = "hotel.nombre", target = "hotelNombre")
    @Mapping(source = "hotel.estrellas", target = "estrellas")
    @Mapping(source = "hotel.ciudad.nombre", target = "ciudadNombre")
    @Mapping(source = "hotel.ciudad.latitud", target = "latitud")
    @Mapping(source = "hotel.ciudad.longitud", target = "longitud")
    @Mapping(source = "hotel.ciudad.departamento.nombre", target = "departamentoNombre")
    // Mapeo de campos adicionales del hotel
    @Mapping(source = "hotel.email", target = "email")
    @Mapping(source = "hotel.descripcion", target = "descripcionHotel")
    @Mapping(source = "hotel.checkIn", target = "checkIn")
    @Mapping(source = "hotel.checkOut", target = "checkOut")
    @Mapping(source = "hotel.createdAt", target = "createdAt")
    @Mapping(source = "hotel.updatedAt", target = "updatedAt")
    @Mapping(source = "hotel.imagenUrl", target = "hotelImagenUrl")
    HabitacionDTO habitacionToHabitacionDTO(Habitacion habitacion);

    List<HabitacionDTO> habitacionesToHabitacionDTOs(List<Habitacion> habitaciones);
    
    @Named("firstImageUrl")
    default String firstImageUrl(List<com.example.Back.Models.ImagenHabitacion> imagenes) {
        if (imagenes != null && !imagenes.isEmpty()) {
            return imagenes.get(0).getUrlImagen();
        }
        return null;
    }
    
    @Named("allImageUrls")
    default List<String> allImageUrls(List<com.example.Back.Models.ImagenHabitacion> imagenes) {
        if (imagenes != null) {
            return imagenes.stream()
                    .map(com.example.Back.Models.ImagenHabitacion::getUrlImagen)
                    .collect(Collectors.toList());
        }
        return List.of();
    }
}