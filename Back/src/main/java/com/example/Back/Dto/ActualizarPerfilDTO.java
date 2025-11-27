package com.example.Back.Dto;

import lombok.Data;

@Data
public class ActualizarPerfilDTO {
    private String nombreCompleto;
    private String telefono;
    private String documento;
    private String email;
    private String contrasena;
    private String fotoUrl;
}