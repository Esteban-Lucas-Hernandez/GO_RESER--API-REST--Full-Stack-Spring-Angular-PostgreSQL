package com.example.Back.Dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImagenHabitacionDTO {
    private Integer idImagen;
    private Integer idHabitacion;
    private String urlImagen;
}