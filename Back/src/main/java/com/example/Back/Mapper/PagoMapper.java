package com.example.Back.Mapper;

import com.example.Back.Dto.PagoDTO;
import com.example.Back.Dto.PagoDetalladoDTO;
import com.example.Back.Models.Pago;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface PagoMapper {
    PagoMapper INSTANCE = Mappers.getMapper(PagoMapper.class);

    @Mapping(source = "reserva.idReserva", target = "idReserva")
    PagoDTO pagoToPagoDTO(Pago pago);
    
    @Mapping(source = "reserva.idReserva", target = "idReserva")
    @Mapping(source = "reserva.habitacion.numero", target = "nombreHabitacion")
    @Mapping(source = "reserva.habitacion.hotel.nombre", target = "nombreHotel")
    @Mapping(source = "reserva.usuario.nombreCompleto", target = "nombreUsuario")
    PagoDetalladoDTO pagoToPagoDetalladoDTO(Pago pago);
}