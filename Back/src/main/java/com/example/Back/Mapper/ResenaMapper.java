package com.example.Back.Mapper;

import com.example.Back.Dto.ResenaDTO;
import com.example.Back.Models.Resena;
import org.springframework.stereotype.Component;

@Component
public class ResenaMapper {

    public ResenaDTO toDTO(Resena resena) {
        if (resena == null) {
            return null;
        }
        
        return new ResenaDTO(
                resena.getIdResena(),
                resena.getUsuario() != null ? resena.getUsuario().getIdUsuario() : null,
                resena.getUsuario() != null ? resena.getUsuario().getNombreCompleto() : null,
                resena.getHotel() != null ? resena.getHotel().getId() : null,
                resena.getComentario(),
                resena.getCalificacion(),
                resena.getFechaResena(),
                resena.getUsuario() != null ? resena.getUsuario().getFotoUrl() : null // Agregar la URL de la foto del usuario
        );
    }
    
    public Resena toEntity(ResenaDTO resenaDTO) {
        if (resenaDTO == null) {
            return null;
        }
        
        Resena resena = new Resena();
        resena.setIdResena(resenaDTO.getIdResena());
        resena.setComentario(resenaDTO.getComentario());
        resena.setCalificacion(resenaDTO.getCalificacion());
        
        return resena;
    }
}