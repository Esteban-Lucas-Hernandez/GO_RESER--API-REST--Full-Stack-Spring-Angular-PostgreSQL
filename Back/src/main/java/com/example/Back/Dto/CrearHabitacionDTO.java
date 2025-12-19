package com.example.Back.Dto;

import java.util.List;

public class CrearHabitacionDTO {
    private String numero;
    private Integer capacidad;
    private Double precio;
    private String descripcion;
    private String estado;
    private Integer categoriaId;
    private String imagenUrl;
    private List<String> imagenesUrls;
    
    // Constructor por defecto
    public CrearHabitacionDTO() {}
    
    // Constructor con parámetros
    public CrearHabitacionDTO(String numero, Integer capacidad, Double precio, String descripcion,
                          String estado, Integer categoriaId, String imagenUrl, List<String> imagenesUrls) {
        this.numero = numero;
        this.capacidad = capacidad;
        this.precio = precio;
        this.descripcion = descripcion;
        this.estado = estado;
        this.categoriaId = categoriaId;
        this.imagenUrl = imagenUrl;
        this.imagenesUrls = imagenesUrls;
    }
    
    // Getters
    public String getNumero() {
        return numero;
    }
    
    public Integer getCapacidad() {
        return capacidad;
    }
    
    public Double getPrecio() {
        return precio;
    }
    
    public String getDescripcion() {
        return descripcion;
    }
    
    public String getEstado() {
        return estado;
    }
    
    public Integer getCategoriaId() {
        return categoriaId;
    }
    
    public String getImagenUrl() {
        return imagenUrl;
    }
    
    public List<String> getImagenesUrls() {
        return imagenesUrls;
    }
    
    // Setters
    public void setNumero(String numero) {
        this.numero = numero;
    }
    
    public void setCapacidad(Integer capacidad) {
        this.capacidad = capacidad;
    }
    
    public void setPrecio(Double precio) {
        this.precio = precio;
    }
    
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public void setEstado(String estado) {
        this.estado = estado;
    }
    
    public void setCategoriaId(Integer categoriaId) {
        this.categoriaId = categoriaId;
    }
    
    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }
    
    public void setImagenesUrls(List<String> imagenesUrls) {
        this.imagenesUrls = imagenesUrls;
    }
    
    // Método toString
    @Override
    public String toString() {
        return "CrearHabitacionDTO{numero='" + numero + '\'' +
                ", capacidad=" + capacidad + ", precio=" + precio +
                ", descripcion='" + descripcion + '\'' + ", estado='" + estado + '\'' +
                ", categoriaId=" + categoriaId + ", imagenUrl='" + imagenUrl + '\'' +
                ", imagenesUrls=" + imagenesUrls + '}';
    }
}