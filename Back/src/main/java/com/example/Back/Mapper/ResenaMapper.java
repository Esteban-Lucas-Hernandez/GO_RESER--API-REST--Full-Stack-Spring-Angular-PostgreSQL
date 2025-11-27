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
        
        return ResenaDTO.builder()
                .idResena(resena.getIdResena())
                .idUsuario(resena.getUsuario() != null ? resena.getUsuario().getIdUsuario() : null)
                .nombreUsuario(resena.getUsuario() != null ? resena.getUsuario().getNombreCompleto() : null)
                .idHotel(resena.getHotel() != null ? resena.getHotel().getId() : null)
                .comentario(resena.getComentario())
                .calificacion(resena.getCalificacion())
                .fechaResena(resena.getFechaResena())
                .fotoUrl(resena.getUsuario() != null ? resena.getUsuario().getFotoUrl() : null) // Agregar la URL de la foto del usuario
                .build();
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