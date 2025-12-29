package com.example.Back.Dto;

import java.time.LocalDateTime;

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
    
    // Constructor por defecto
    public PagoDetalladoDTO() {}
    
    // Constructor con parámetros
    public PagoDetalladoDTO(Integer idPago, Integer idReserva, String referenciaPago, String metodo, LocalDateTime fechaPago, Double monto, String nombreHabitacion, String nombreHotel, String nombreUsuario) {
        this.idPago = idPago;
        this.idReserva = idReserva;
        this.referenciaPago = referenciaPago;
        this.metodo = metodo;
        this.fechaPago = fechaPago;
        this.monto = monto;
        this.nombreHabitacion = nombreHabitacion;
        this.nombreHotel = nombreHotel;
        this.nombreUsuario = nombreUsuario;
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
    
    public String getNombreHabitacion() {
        return nombreHabitacion;
    }
    
    public String getNombreHotel() {
        return nombreHotel;
    }
    
    public String getNombreUsuario() {
        return nombreUsuario;
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
    
    public void setNombreHabitacion(String nombreHabitacion) {
        this.nombreHabitacion = nombreHabitacion;
    }
    
    public void setNombreHotel(String nombreHotel) {
        this.nombreHotel = nombreHotel;
    }
    
    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }
    
    // Método toString
    @Override
    public String toString() {
        return "PagoDetalladoDTO{idPago=" + idPago + ", idReserva=" + idReserva +
                ", referenciaPago='" + referenciaPago + '\'' + ", metodo='" + metodo + '\'' +
                ", fechaPago=" + fechaPago + ", monto=" + monto +
                ", nombreHabitacion='" + nombreHabitacion + '\'' + ", nombreHotel='" + nombreHotel + '\'' +
                ", nombreUsuario='" + nombreUsuario + '\'' + '}';
    }
}