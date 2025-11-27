package com.example.Back.Dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoriaHabitacionDTO {
    private Integer id;
    private String nombre;
    private String descripcion;
    private Integer usuarioId;
}