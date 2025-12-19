package com.example.Back.Models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "ciudades")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Ciudad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ciudad")
    private Integer id;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "latitud", precision = 10, scale = 8)
    private BigDecimal latitud;

    @Column(name = "longitud", precision = 11, scale = 8)
    private BigDecimal longitud;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "id_departamento", 
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_ciudad_departamento")
    )
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "ciudades"})
    private Departamento departamento;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
    
    // Constructor por defecto
    public Ciudad() {}
    
    // Constructor con parámetros
    public Ciudad(Integer id, String nombre, BigDecimal latitud, BigDecimal longitud, Departamento departamento, LocalDateTime createdAt) {
        this.id = id;
        this.nombre = nombre;
        this.latitud = latitud;
        this.longitud = longitud;
        this.departamento = departamento;
        this.createdAt = createdAt;
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
    
    public Departamento getDepartamento() {
        return departamento;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
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
    
    public void setDepartamento(Departamento departamento) {
        this.departamento = departamento;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    // Métodos equals y hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Ciudad)) return false;
        Ciudad ciudad = (Ciudad) o;
        return id != null && id.equals(ciudad.id);
    }
    
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
    
    // Método toString
    @Override
    public String toString() {
        return "Ciudad{id=" + id + ", nombre='" + nombre + '\'' +
                ", latitud=" + latitud + ", longitud=" + longitud +
                ", departamento=" + departamento + ", createdAt=" + createdAt + '}';
    }
}