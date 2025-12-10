package com.example.Back.Dto;

import lombok.*;
import java.util.List;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HabitacionDetalleDTO {
    private Integer idHabitacion;
    private Integer idHotel;
    private CategoriaHabitacionDTO categoria;
    private String numero;
    private Integer capacidad;
    private Double precio;
    private String descripcion;
    private String estado;
    private List<String> imagenesUrls;
    
    // Campos adicionales del hotel
    private String hotelNombre;
    private String ciudadNombre;
    private String departamentoNombre;
    private LocalTime checkIn;
    private LocalTime checkOut;
}