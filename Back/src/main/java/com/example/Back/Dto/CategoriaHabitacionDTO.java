package com.example.Back.Dto;

public class CategoriaHabitacionDTO {
    private Integer id;
    private String nombre;
    private String descripcion;
    private Integer usuarioId;
    
    // Constructor por defecto
    public CategoriaHabitacionDTO() {}
    
    // Constructor con parámetros
    public CategoriaHabitacionDTO(Integer id, String nombre, String descripcion, Integer usuarioId) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.usuarioId = usuarioId;
    }
    
    // Getters
    public Integer getId() {
        return id;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public String getDescripcion() {
        return descripcion;
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
    
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public void setUsuarioId(Integer usuarioId) {
        this.usuarioId = usuarioId;
    }
    
    // Método toString
    @Override
    public String toString() {
        return "CategoriaHabitacionDTO{id=" + id + ", nombre='" + nombre + '\'' +
                ", descripcion='" + descripcion + '\'' + ", usuarioId=" + usuarioId + '}';
    }
}