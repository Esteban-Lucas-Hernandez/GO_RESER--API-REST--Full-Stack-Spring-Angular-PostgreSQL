package com.example.Back.Dto;

import java.math.BigDecimal;

public class CiudadDTO {
    private Integer id;
    private String nombre;
    private BigDecimal latitud;
    private BigDecimal longitud;
    private Integer departamentoId;
    private String departamentoNombre;
    
    // Constructor por defecto
    public CiudadDTO() {}
    
    // Constructor con parámetros
    public CiudadDTO(Integer id, String nombre, BigDecimal latitud, BigDecimal longitud, 
                   Integer departamentoId, String departamentoNombre) {
        this.id = id;
        this.nombre = nombre;
        this.latitud = latitud;
        this.longitud = longitud;
        this.departamentoId = departamentoId;
        this.departamentoNombre = departamentoNombre;
    }
    
    // Getters
    public Integer getId() {
        return id;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public BigDecimal getLatitud() {
        return latitud;
    }
    
    public BigDecimal getLongitud() {
        return longitud;
    }
    
    public Integer getDepartamentoId() {
        return departamentoId;
    }
    
    public String getDepartamentoNombre() {
        return departamentoNombre;
    }
    
    // Setters
    public void setId(Integer id) {
        this.id = id;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public void setLatitud(BigDecimal latitud) {
        this.latitud = latitud;
    }
    
    public void setLongitud(BigDecimal longitud) {
        this.longitud = longitud;
    }
    
    public void setDepartamentoId(Integer departamentoId) {
        this.departamentoId = departamentoId;
    }
    
    public void setDepartamentoNombre(String departamentoNombre) {
        this.departamentoNombre = departamentoNombre;
    }
    
    // Método toString
    @Override
    public String toString() {
        return "CiudadDTO{id=" + id + ", nombre='" + nombre + '\'' +
                ", latitud=" + latitud + ", longitud=" + longitud +
                ", departamentoId=" + departamentoId + ", departamentoNombre='" + departamentoNombre + '\'' + '}';
    }
}