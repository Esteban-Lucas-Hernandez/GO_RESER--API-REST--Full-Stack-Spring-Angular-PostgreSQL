package com.example.Back.Dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ReservaDTO {
    private Integer idReserva;
    private String emailUsuario;
    private String numeroHabitacion;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Double total;
    private String estado;
    private String metodoPago;
    private LocalDateTime fechaReserva;
    private String nombreHotel;
}