package com.example.Back.Models;

import jakarta.persistence.*;

@Entity
@Table(name = "categorias_habitacion")
public class CategoriaHabitacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria")
    private Integer id;

    @Column(name = "nombre", nullable = false, length = 50, unique = true)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    // Relación con Usuario - Campo usuario_id en la tabla categorias
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = true)
    private Usuario usuario;
    
    // Constructor por defecto
    public CategoriaHabitacion() {}
    
    // Constructor con parámetros
    public CategoriaHabitacion(Integer id, String nombre, String descripcion, Usuario usuario) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.usuario = usuario;
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
    
    public Usuario getUsuario() {
        return usuario;
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
    
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    
    // Métodos equals y hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CategoriaHabitacion)) return false;
        CategoriaHabitacion that = (CategoriaHabitacion) o;
        return id != null && id.equals(that.id);
    }
    
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
    
    // Método toString
    @Override
    public String toString() {
        return "CategoriaHabitacion{id=" + id + ", nombre='" + nombre + '\'' +
                ", descripcion='" + descripcion + '\'' + ", usuario=" + usuario + '}';
    }
}