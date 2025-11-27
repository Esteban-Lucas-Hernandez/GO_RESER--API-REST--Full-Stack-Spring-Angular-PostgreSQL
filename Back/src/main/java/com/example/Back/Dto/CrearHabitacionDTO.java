package com.example.Back.Dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CrearHabitacionDTO {
    private String numero;
    private Integer capacidad;
    private Double precio;
    private String descripcion;
    private String estado;
    private Integer categoriaId;
    private String imagenUrl;
    private List<String> imagenesUrls;
}