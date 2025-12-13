package com.example.Back.Mapper;

import com.example.Back.Models.Reserva;
import com.example.Back.Dto.ReservaDTO;
import com.example.Back.Models.ImagenHabitacion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;
import java.util.List;

@Mapper
public interface ReservaMapper {
    ReservaMapper INSTANCE = Mappers.getMapper(ReservaMapper.class);

    @Mapping(source = "usuario.email", target = "emailUsuario")
    @Mapping(source = "habitacion.numero", target = "numeroHabitacion")
    @Mapping(source = "habitacion.hotel.nombre", target = "nombreHotel")
    @Mapping(source = "habitacion.imagenes", target = "urlImagenHabitacion", qualifiedByName = "mapFirstImageUrl")
    ReservaDTO reservaToReservaDTO(Reserva reserva);
    
    @Mapping(source = "emailUsuario", target = "usuario.email")
    @Mapping(source = "numeroHabitacion", target = "habitacion.numero")
    @Mapping(source = "nombreHotel", target = "habitacion.hotel.nombre")
    @Mapping(source = "urlImagenHabitacion", target = "habitacion.imagenes", ignore = true)
    Reserva reservaDTOToReserva(ReservaDTO reservaDTO);
    
    @Named("mapFirstImageUrl")
    default String mapFirstImageUrl(List<ImagenHabitacion> imagenes) {
        if (imagenes != null && !imagenes.isEmpty()) {
            return imagenes.get(0).getUrlImagen();
        }
        return null;
    }
}