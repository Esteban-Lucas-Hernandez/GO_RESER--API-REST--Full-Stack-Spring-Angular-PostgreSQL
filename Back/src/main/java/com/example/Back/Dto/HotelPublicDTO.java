package com.example.Back.Dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class HotelPublicDTO {
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
    private Ciudad ciudad;
    private Double latitud;
    private Double longitud;
}