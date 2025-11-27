package com.example.Back.Dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CrearReservaDTO {
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String metodoPago; // tarjeta, efectivo, transferencia, nequi, daviplata
}