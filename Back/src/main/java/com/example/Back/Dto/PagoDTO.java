package com.example.Back.Dto;

import java.time.LocalDateTime;

public class PagoDTO {
    private Integer idPago;
    private Integer idReserva;
    private String referenciaPago;
    private String metodo;
    private LocalDateTime fechaPago;
    private Double monto;
    
    // Constructor por defecto
    public PagoDTO() {}
    
    // Constructor con parámetros
    public PagoDTO(Integer idPago, Integer idReserva, String referenciaPago, String metodo, LocalDateTime fechaPago, Double monto) {
        this.idPago = idPago;
        this.idReserva = idReserva;
        this.referenciaPago = referenciaPago;
        this.metodo = metodo;
        this.fechaPago = fechaPago;
        this.monto = monto;
    }
    
    // Getters
    public Integer getIdPago() {
        return idPago;
    }
    
    public Integer getIdReserva() {
        return idReserva;
    }
    
    public String getReferenciaPago() {
        return referenciaPago;
    }
    
    public String getMetodo() {
        return metodo;
    }
    
    public LocalDateTime getFechaPago() {
        return fechaPago;
    }
    
    public Double getMonto() {
        return monto;
    }
    
    // Setters
    public void setIdPago(Integer idPago) {
        this.idPago = idPago;
    }
    
    public void setIdReserva(Integer idReserva) {
        this.idReserva = idReserva;
    }
    
    public void setReferenciaPago(String referenciaPago) {
        this.referenciaPago = referenciaPago;
    }
    
    public void setMetodo(String metodo) {
        this.metodo = metodo;
    }
    
    public void setFechaPago(LocalDateTime fechaPago) {
        this.fechaPago = fechaPago;
    }
    
    public void setMonto(Double monto) {
        this.monto = monto;
    }
    
    // Método toString
    @Override
    public String toString() {
        return "PagoDTO{idPago=" + idPago + ", idReserva=" + idReserva +
                ", referenciaPago='" + referenciaPago + '\'' + ", metodo='" + metodo + '\'' +
                ", fechaPago=" + fechaPago + ", monto=" + monto + '}';
    }
}