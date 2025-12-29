package com.example.Back.Dto;

public class Ciudad {
    private Integer id;
    private String nombre;
    private Double latitud;
    private Double longitud;
    private Departamento departamento;
    
    // Constructor por defecto
    public Ciudad() {}
    
    // Constructor con parámetros
    public Ciudad(Integer id, String nombre, Double latitud, Double longitud, Departamento departamento) {
        this.id = id;
        this.nombre = nombre;
        this.latitud = latitud;
        this.longitud = longitud;
        this.departamento = departamento;
    }
    
    // Getters
    public Integer getId() {
        return id;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public Double getLatitud() {
        return latitud;
    }
    
    public Double getLongitud() {
        return longitud;
    }
    
    public Departamento getDepartamento() {
        return departamento;
    }
    
    // Setters
    public void setId(Integer id) {
        this.id = id;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public void setLatitud(Double latitud) {
        this.latitud = latitud;
    }
    
    public void setLongitud(Double longitud) {
        this.longitud = longitud;
    }
    
    public void setDepartamento(Departamento departamento) {
        this.departamento = departamento;
    }
    
    // Método toString
    @Override
    public String toString() {
        return "Ciudad{id=" + id + ", nombre='" + nombre + '\'' +
                ", latitud=" + latitud + ", longitud=" + longitud +
                ", departamento=" + departamento + '}';
    }
}