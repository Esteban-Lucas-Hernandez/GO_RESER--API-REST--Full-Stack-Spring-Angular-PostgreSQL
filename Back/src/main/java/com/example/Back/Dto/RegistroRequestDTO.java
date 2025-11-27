package com.example.Back.Dto;

import lombok.Data;

@Data
public class RegistroRequestDTO {
    private String nombreCompleto;
    private String email;
    private String telefono;
    private String documento;
    private String contrasena;
    private String fotoUrl;
}