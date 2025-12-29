package com.example.Back.Dto;

import java.time.LocalDateTime;
import java.time.LocalTime;

public class HotelDTO {
    private Integer id;
    private String nombre;
    private String direccion;
    private String telefono;
    private String email;
    private String descripcion;
    private Integer estrellas;
    private String politicaCancelacion;
    private LocalTime checkIn;
    private LocalTime checkOut;
    private String imagenUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String ciudadNombre;
    private String departamentoNombre;
    private Integer ciudadId; // Agregado para facilitar la creación/actualización
    private Integer usuarioId; // ID del usuario que creó el hotel
    
    // Constructor por defecto
    public HotelDTO() {}
    
    // Constructor con parámetros
    public HotelDTO(Integer id, String nombre, String direccion, String telefono, String email,
                  String descripcion, Integer estrellas, String politicaCancelacion, LocalTime checkIn,
                  LocalTime checkOut, String imagenUrl, LocalDateTime createdAt, LocalDateTime updatedAt,
                  String ciudadNombre, String departamentoNombre, Integer ciudadId, Integer usuarioId) {
        this.id = id;
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.email = email;
        this.descripcion = descripcion;
        this.estrellas = estrellas;
        this.politicaCancelacion = politicaCancelacion;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.imagenUrl = imagenUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.ciudadNombre = ciudadNombre;
        this.departamentoNombre = departamentoNombre;
        this.ciudadId = ciudadId;
        this.usuarioId = usuarioId;
    }
    
    // Getters
    public Integer getId() {
        return id;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public String getDireccion() {
        return direccion;
    }
    
    public String getTelefono() {
        return telefono;
    }
    
    public String getEmail() {
        return email;
    }
    
    public String getDescripcion() {
        return descripcion;
    }
    
    public Integer getEstrellas() {
        return estrellas;
    }
    
    public String getPoliticaCancelacion() {
        return politicaCancelacion;
    }
    
    public LocalTime getCheckIn() {
        return checkIn;
    }
    
    public LocalTime getCheckOut() {
        return checkOut;
    }
    
    public String getImagenUrl() {
        return imagenUrl;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public String getCiudadNombre() {
        return ciudadNombre;
    }
    
    public String getDepartamentoNombre() {
        return departamentoNombre;
    }
    
    public Integer getCiudadId() {
        return ciudadId;
    }
    
    public Integer getUsuarioId() {
        return usuarioId;
    }
    
    // Setters
    public void setId(Integer id) {
        this.id = id;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
    
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public void setEstrellas(Integer estrellas) {
        this.estrellas = estrellas;
    }
    
    public void setPoliticaCancelacion(String politicaCancelacion) {
        this.politicaCancelacion = politicaCancelacion;
    }
    
    public void setCheckIn(LocalTime checkIn) {
        this.checkIn = checkIn;
    }
    
    public void setCheckOut(LocalTime checkOut) {
        this.checkOut = checkOut;
    }
    
    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public void setCiudadNombre(String ciudadNombre) {
        this.ciudadNombre = ciudadNombre;
    }
    
    public void setDepartamentoNombre(String departamentoNombre) {
        this.departamentoNombre = departamentoNombre;
    }
    
    public void setCiudadId(Integer ciudadId) {
        this.ciudadId = ciudadId;
    }
    
    public void setUsuarioId(Integer usuarioId) {
        this.usuarioId = usuarioId;
    }
    
    // Método toString
    @Override
    public String toString() {
        return "HotelDTO{id=" + id + ", nombre='" + nombre + '\'' +
                ", direccion='" + direccion + '\'' + ", telefono='" + telefono + '\'' +
                ", email='" + email + '\'' + ", descripcion='" + descripcion + '\'' +
                ", estrellas=" + estrellas + ", politicaCancelacion='" + politicaCancelacion + '\'' +
                ", checkIn=" + checkIn + ", checkOut=" + checkOut +
                ", imagenUrl='" + imagenUrl + '\'' + ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt + ", ciudadNombre='" + ciudadNombre + '\'' +
                ", departamentoNombre='" + departamentoNombre + '\'' + ", ciudadId=" + ciudadId +
                ", usuarioId=" + usuarioId + '}';
    }
}