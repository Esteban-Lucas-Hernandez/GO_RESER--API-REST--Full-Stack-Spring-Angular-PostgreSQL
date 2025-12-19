package com.example.Back.Dto;

import java.time.LocalDate;

public class CrearReservaDTO {
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String metodoPago; // tarjeta, efectivo, transferencia, nequi, daviplata
    
    // Constructor por defecto
    public CrearReservaDTO() {}
    
    // Constructor con parámetros
    public CrearReservaDTO(LocalDate fechaInicio, LocalDate fechaFin, String metodoPago) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.metodoPago = metodoPago;
    }
    
    // Getters
    public LocalDate getFechaInicio() {
        return fechaInicio;
    }
    
    public LocalDate getFechaFin() {
        return fechaFin;
    }
    
    public String getMetodoPago() {
        return metodoPago;
    }
    
    // Setters
    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }
    
    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }
    
    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }
    
    // Método toString
    @Override
    public String toString() {
        return "CrearReservaDTO{fechaInicio=" + fechaInicio + ", fechaFin=" + fechaFin +
                ", metodoPago='" + metodoPago + '\'' + '}';
    }
}