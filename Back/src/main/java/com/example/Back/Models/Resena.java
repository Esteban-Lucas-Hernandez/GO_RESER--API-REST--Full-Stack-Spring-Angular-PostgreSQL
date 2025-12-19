package com.example.Back.Models;

import jakarta.persistence.*;

@Entity
@Table(name = "resenas")
public class Resena {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_resena")
    private Integer idResena;

    // Relación con Usuario
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    // Relación con Hotel
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_hotel", nullable = false)
    private Hotel hotel;

    @Column(columnDefinition = "TEXT")
    private String comentario;

    @Column(nullable = false)
    private Integer calificacion;  // 1 a 5

    @Column(name = "fecha_resena", updatable = false)
    private String fechaResena;
    
    @PrePersist
    protected void onCreate() {
        this.fechaResena = java.time.LocalDate.now().toString();
    }
    
    // Constructor por defecto
    public Resena() {}
    
    // Constructor con parámetros
    public Resena(Integer idResena, Usuario usuario, Hotel hotel, String comentario, Integer calificacion, String fechaResena) {
        this.idResena = idResena;
        this.usuario = usuario;
        this.hotel = hotel;
        this.comentario = comentario;
        this.calificacion = calificacion;
        this.fechaResena = fechaResena;
    }
    
    // Getters
    public Integer getIdResena() {
        return idResena;
    }
    
    public Usuario getUsuario() {
        return usuario;
    }
    
    public Hotel getHotel() {
        return hotel;
    }
    
    public String getComentario() {
        return comentario;
    }
    
    public Integer getCalificacion() {
        return calificacion;
    }
    
    public String getFechaResena() {
        return fechaResena;
    }
    
    // Setters
    public void setIdResena(Integer idResena) {
        this.idResena = idResena;
    }
    
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    
    public void setHotel(Hotel hotel) {
        this.hotel = hotel;
    }
    
    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
    
    public void setCalificacion(Integer calificacion) {
        this.calificacion = calificacion;
    }
    
    public void setFechaResena(String fechaResena) {
        this.fechaResena = fechaResena;
    }
    
    // Métodos equals y hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Resena)) return false;
        Resena resena = (Resena) o;
        return idResena != null && idResena.equals(resena.idResena);
    }
    
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
    
    // Método toString
    @Override
    public String toString() {
        return "Resena{idResena=" + idResena + ", usuario=" + usuario +
                ", hotel=" + hotel + ", comentario='" + comentario + '\'' +
                ", calificacion=" + calificacion + ", fechaResena='" + fechaResena + '\'' + '}';
    }
}