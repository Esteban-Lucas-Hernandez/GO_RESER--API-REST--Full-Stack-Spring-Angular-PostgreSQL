package com.example.Back.Models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "habitaciones")
public class Habitacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_habitacion")
    private Integer idHabitacion;

    // Relación con hotel (NOT NULL, ON DELETE CASCADE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_hotel", nullable = false)
    private Hotel hotel;

    // Relación con categoría (nullable, ON DELETE SET NULL)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categoria", nullable = true)
    private CategoriaHabitacion categoria;

    @Column(nullable = false, length = 20)
    private String numero;

    @Column(nullable = false)
    private Integer capacidad = 1;

    @Column(name = "precio", nullable = false)
    private Double precio;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoHabitacion estado = EstadoHabitacion.disponible;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relación con reservas con eliminación en cascada
    @OneToMany(mappedBy = "habitacion", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Reserva> reservas;

    // Manejo automático de fechas
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @OneToMany(mappedBy = "habitacion", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<ImagenHabitacion> imagenes;
    
    // Enum para el estado
    public enum EstadoHabitacion {
        disponible,
        mantenimiento
    }
    
    // Constructor por defecto
    public Habitacion() {}
    
    // Constructor con parámetros
    public Habitacion(Integer idHabitacion, Hotel hotel, CategoriaHabitacion categoria, String numero,
                     Integer capacidad, Double precio, String descripcion, EstadoHabitacion estado,
                     LocalDateTime createdAt, LocalDateTime updatedAt, List<Reserva> reservas,
                     List<ImagenHabitacion> imagenes) {
        this.idHabitacion = idHabitacion;
        this.hotel = hotel;
        this.categoria = categoria;
        this.numero = numero;
        this.capacidad = capacidad != null ? capacidad : 1;
        this.precio = precio;
        this.descripcion = descripcion;
        this.estado = estado != null ? estado : EstadoHabitacion.disponible;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.reservas = reservas;
        this.imagenes = imagenes;
    }
    
    // Getters
    public Integer getIdHabitacion() {
        return idHabitacion;
    }
    
    public Hotel getHotel() {
        return hotel;
    }
    
    public CategoriaHabitacion getCategoria() {
        return categoria;
    }
    
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
    
    public EstadoHabitacion getEstado() {
        return estado;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public List<Reserva> getReservas() {
        return reservas;
    }
    
    public List<ImagenHabitacion> getImagenes() {
        return imagenes;
    }
    
    // Setters
    public void setIdHabitacion(Integer idHabitacion) {
        this.idHabitacion = idHabitacion;
    }
    
    public void setHotel(Hotel hotel) {
        this.hotel = hotel;
    }
    
    public void setCategoria(CategoriaHabitacion categoria) {
        this.categoria = categoria;
    }
    
    public void setNumero(String numero) {
        this.numero = numero;
    }
    
    public void setCapacidad(Integer capacidad) {
        this.capacidad = capacidad != null ? capacidad : 1;
    }
    
    public void setPrecio(Double precio) {
        this.precio = precio;
    }
    
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public void setEstado(EstadoHabitacion estado) {
        this.estado = estado != null ? estado : EstadoHabitacion.disponible;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public void setReservas(List<Reserva> reservas) {
        this.reservas = reservas;
    }
    
    public void setImagenes(List<ImagenHabitacion> imagenes) {
        this.imagenes = imagenes;
    }
    
    // Métodos equals y hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Habitacion)) return false;
        Habitacion that = (Habitacion) o;
        return idHabitacion != null && idHabitacion.equals(that.idHabitacion);
    }
    
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
    
    // Método toString
    @Override
    public String toString() {
        return "Habitacion{idHabitacion=" + idHabitacion + ", hotel=" + hotel +
                ", categoria=" + categoria + ", numero='" + numero + '\'' +
                ", capacidad=" + capacidad + ", precio=" + precio +
                ", descripcion='" + descripcion + '\'' + ", estado=" + estado +
                ", createdAt=" + createdAt + ", updatedAt=" + updatedAt +
                ", reservas=" + reservas + ", imagenes=" + imagenes + '}';
    }
}