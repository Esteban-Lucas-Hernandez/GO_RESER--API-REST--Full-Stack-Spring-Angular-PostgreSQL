package com.example.Back.Dto;

public class Departamento {
    private Integer id;
    private String nombre;
    
    // Constructor por defecto
    public Departamento() {}
    
    // Constructor con parámetros
    public Departamento(Integer id, String nombre) {
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
        return "Departamento{id=" + id + ", nombre='" + nombre + '\'' + '}';
    }
}