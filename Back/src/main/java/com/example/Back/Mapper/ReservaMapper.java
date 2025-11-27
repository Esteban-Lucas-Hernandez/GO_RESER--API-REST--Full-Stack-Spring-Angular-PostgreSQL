package com.example.Back.Mapper;

import com.example.Back.Models.Reserva;
import com.example.Back.Dto.ReservaDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ReservaMapper {
    ReservaMapper INSTANCE = Mappers.getMapper(ReservaMapper.class);

    @Mapping(source = "usuario.email", target = "emailUsuario")
    @Mapping(source = "habitacion.numero", target = "numeroHabitacion")
    @Mapping(source = "habitacion.hotel.nombre", target = "nombreHotel")
    ReservaDTO reservaToReservaDTO(Reserva reserva);
    
    @Mapping(source = "emailUsuario", target = "usuario.email")
    @Mapping(source = "numeroHabitacion", target = "habitacion.numero")
    @Mapping(source = "nombreHotel", target = "habitacion.hotel.nombre")
    Reserva reservaDTOToReserva(ReservaDTO reservaDTO);
}