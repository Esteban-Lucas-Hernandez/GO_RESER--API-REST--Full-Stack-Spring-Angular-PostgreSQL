package com.example.Back.Dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class HotelDTO {
    private Integer id;
    private String nombre;
    private String direccion;
    private String telefono;
    private String email;
    private String descripcion;
    private Integer estrellas;
    private String politicaCancelacion;
    private LocalTime checkIn;
    private LocalTime checkOut;
    private String imagenUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String ciudadNombre;
    private String departamentoNombre;
    private Integer ciudadId; // Agregado para facilitar la creación/actualización
    private Integer usuarioId; // ID del usuario que creó el hotel
}