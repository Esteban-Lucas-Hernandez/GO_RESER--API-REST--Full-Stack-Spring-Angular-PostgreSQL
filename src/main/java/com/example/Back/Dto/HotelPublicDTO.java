package com.example.Back.Dto;

import java.time.LocalDateTime;
import java.time.LocalTime;

public class HotelPublicDTO {
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
    private Ciudad ciudad;
    private Double latitud;
    private Double longitud;
    
    // Constructor por defecto
    public HotelPublicDTO() {}
    
    // Constructor con parámetros
    public HotelPublicDTO(Integer id, String nombre, String direccion, String telefono, String email,
                       String descripcion, Integer estrellas, String politicaCancelacion, LocalTime checkIn,
                       LocalTime checkOut, String imagenUrl, LocalDateTime createdAt, LocalDateTime updatedAt,
                       Ciudad ciudad, Double latitud, Double longitud) {
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
        this.ciudad = ciudad;
        this.latitud = latitud;
        this.longitud = longitud;
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
    
    public Ciudad getCiudad() {
        return ciudad;
    }
    
    public Double getLatitud() {
        return latitud;
    }
    
    public Double getLongitud() {
        return longitud;
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
    
    public void setCiudad(Ciudad ciudad) {
        this.ciudad = ciudad;
    }
    
    public void setLatitud(Double latitud) {
        this.latitud = latitud;
    }
    
    public void setLongitud(Double longitud) {
        this.longitud = longitud;
    }
    
    // Método toString
    @Override
    public String toString() {
        return "HotelPublicDTO{id=" + id + ", nombre='" + nombre + '\'' +
                ", direccion='" + direccion + '\'' + ", telefono='" + telefono + '\'' +
                ", email='" + email + '\'' + ", descripcion='" + descripcion + '\'' +
                ", estrellas=" + estrellas + ", politicaCancelacion='" + politicaCancelacion + '\'' +
                ", checkIn=" + checkIn + ", checkOut=" + checkOut +
                ", imagenUrl='" + imagenUrl + '\'' + ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt + ", ciudad=" + ciudad +
                ", latitud=" + latitud + ", longitud=" + longitud + '}';
    }
}