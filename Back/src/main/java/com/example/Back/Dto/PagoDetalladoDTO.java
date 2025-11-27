package com.example.Back.Dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PagoDetalladoDTO {
    private Integer idPago;
    private Integer idReserva;
    private String referenciaPago;
    private String metodo;
    private LocalDateTime fechaPago;
    private Double monto;
    
    // Información adicional solicitada
    private String nombreHabitacion;
    private String nombreHotel;
    private String nombreUsuario;
}