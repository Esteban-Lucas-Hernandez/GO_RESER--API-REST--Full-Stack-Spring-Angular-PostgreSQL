package com.example.Back.Dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
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
    private Integer estrellas; // Campo agregado para las estrellas del hotel
    
    // Información de la ciudad del hotel
    private String ciudadNombre;
    private BigDecimal latitud;
    private BigDecimal longitud;
    
    // Información del departamento
    private String departamentoNombre; // Campo agregado para el nombre del departamento
    
    // Campos adicionales del hotel solicitados
    private String email;
    private String descripcionHotel;
    private LocalTime checkIn;
    private LocalTime checkOut;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Imagen del hotel
    private String hotelImagenUrl;
    
    // Política de cancelación del hotel
    private String politicaCancelacion;
}