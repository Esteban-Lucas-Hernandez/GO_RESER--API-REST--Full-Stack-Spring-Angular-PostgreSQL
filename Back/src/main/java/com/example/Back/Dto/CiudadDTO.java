package com.example.Back.Dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CiudadDTO {
    private Integer id;
    private String nombre;
    private BigDecimal latitud;
    private BigDecimal longitud;
    private Integer departamentoId;
    private String departamentoNombre;
}