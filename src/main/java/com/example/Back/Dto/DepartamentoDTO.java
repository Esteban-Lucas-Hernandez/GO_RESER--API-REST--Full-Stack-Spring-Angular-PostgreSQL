package com.example.Back.Dto;

public class DepartamentoDTO {
    private Integer id;
    private String nombre;
    
    // Constructor por defecto
    public DepartamentoDTO() {}
    
    // Constructor con parámetros
    public DepartamentoDTO(Integer id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }
    
    // Getters
    public Integer getId() {
        return id;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    // Setters
    public void setId(Integer id) {
        this.id = id;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    // Método toString
    @Override
    public String toString() {
        return "DepartamentoDTO{id=" + id + ", nombre='" + nombre + '\'' + '}';
    }
}