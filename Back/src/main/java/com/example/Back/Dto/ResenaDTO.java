package com.example.Back.Dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResenaDTO {
    private Integer idResena;
    private Integer idUsuario;
    private String nombreUsuario;
    private Integer idHotel;
    private String comentario;
    private Integer calificacion;
    private String fechaResena;
    private String fotoUrl;
}