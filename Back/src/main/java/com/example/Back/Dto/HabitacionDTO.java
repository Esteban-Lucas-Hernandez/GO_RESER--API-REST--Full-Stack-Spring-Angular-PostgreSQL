package com.example.Back.Dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HabitacionDTO {
    private Integer idHabitacion;
    private Integer idHotel;
    private CategoriaHabitacionDTO categoria;
    private String numero;
    private Integer capacidad;
    private Double precio;
    private String descripcion;
    private String estado;
    private String imagenUrl;
    private List<String> imagenesUrls; // Lista de URLs de imágenes
    
    // Información del hotel
    private String hotelNombre;
    
    // Información de la ciudad del hotel
    private String ciudadNombre;
    private BigDecimal latitud;
    private BigDecimal longitud;
}