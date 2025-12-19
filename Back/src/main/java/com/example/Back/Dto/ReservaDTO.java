package com.example.Back.Dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
    private String urlImagenHabitacion;
    
    // Constructor por defecto
    public ReservaDTO() {}
    
    // Constructor con parámetros
    public ReservaDTO(Integer idReserva, String emailUsuario, String numeroHabitacion, LocalDate fechaInicio, LocalDate fechaFin, Double total, String estado, String metodoPago, LocalDateTime fechaReserva, String nombreHotel, String urlImagenHabitacion) {
        this.idReserva = idReserva;
        this.emailUsuario = emailUsuario;
        this.numeroHabitacion = numeroHabitacion;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.total = total;
        this.estado = estado;
        this.metodoPago = metodoPago;
        this.fechaReserva = fechaReserva;
        this.nombreHotel = nombreHotel;
        this.urlImagenHabitacion = urlImagenHabitacion;
    }
    
    // Getters
    public Integer getIdReserva() {
        return idReserva;
    }
    
    public String getEmailUsuario() {
        return emailUsuario;
    }
    
    public String getNumeroHabitacion() {
        return numeroHabitacion;
    }
    
    public LocalDate getFechaInicio() {
        return fechaInicio;
    }
    
    public LocalDate getFechaFin() {
        return fechaFin;
    }
    
    public Double getTotal() {
        return total;
    }
    
    public String getEstado() {
        return estado;
    }
    
    public String getMetodoPago() {
        return metodoPago;
    }
    
    public LocalDateTime getFechaReserva() {
        return fechaReserva;
    }
    
    public String getNombreHotel() {
        return nombreHotel;
    }
    
    public String getUrlImagenHabitacion() {
        return urlImagenHabitacion;
    }
    
    // Setters
    public void setIdReserva(Integer idReserva) {
        this.idReserva = idReserva;
    }
    
    public void setEmailUsuario(String emailUsuario) {
        this.emailUsuario = emailUsuario;
    }
    
    public void setNumeroHabitacion(String numeroHabitacion) {
        this.numeroHabitacion = numeroHabitacion;
    }
    
    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }
    
    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }
    
    public void setTotal(Double total) {
        this.total = total;
    }
    
    public void setEstado(String estado) {
        this.estado = estado;
    }
    
    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }
    
    public void setFechaReserva(LocalDateTime fechaReserva) {
        this.fechaReserva = fechaReserva;
    }
    
    public void setNombreHotel(String nombreHotel) {
        this.nombreHotel = nombreHotel;
    }
    
    public void setUrlImagenHabitacion(String urlImagenHabitacion) {
        this.urlImagenHabitacion = urlImagenHabitacion;
    }
    
    // Método toString
    @Override
    public String toString() {
        return "ReservaDTO{idReserva=" + idReserva + ", emailUsuario='" + emailUsuario + '\'' +
                ", numeroHabitacion='" + numeroHabitacion + '\'' + ", fechaInicio=" + fechaInicio +
                ", fechaFin=" + fechaFin + ", total=" + total + ", estado='" + estado + '\'' +
                ", metodoPago='" + metodoPago + '\'' + ", fechaReserva=" + fechaReserva +
                ", nombreHotel='" + nombreHotel + '\'' + ", urlImagenHabitacion='" + urlImagenHabitacion + '\'' + '}';
    }
}