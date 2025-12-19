package com.example.Back.Models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "hoteles")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_hotel")
    private Integer id;

    @Column(name = "nombre", nullable = false, length = 150)
    private String nombre;

    @Column(name = "direccion", nullable = false, length = 200)
    private String direccion;

    @Column(name = "telefono", length = 50)
    private String telefono;

    @Column(name = "email", length = 100)
    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "id_ciudad", 
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_hotel_ciudad")
    )
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "hoteles"})
    private Ciudad ciudad;

    // Relación con el usuario que creó el hotel
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "id_usuario", 
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_hotel_usuario")
    )
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "hoteles"})
    private Usuario usuario;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(columnDefinition = "INT DEFAULT 3")
    private Integer estrellas;

    @Column(name = "politica_cancelacion", columnDefinition = "TEXT")
    private String politicaCancelacion;

    @Column(name = "check_in")
    private LocalTime checkIn = LocalTime.of(15, 0);

    @Column(name = "check_out")
    private LocalTime checkOut = LocalTime.of(12, 0);

    @Column(name = "imagen_url", length = 500)
    private String imagenUrl;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relación con habitaciones con eliminación en cascada
    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Habitacion> habitaciones;

    // Relación con reseñas con eliminación en cascada
    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Resena> resenas;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Constructor por defecto
    public Hotel() {}
    
    // Constructor con parámetros
    public Hotel(Integer id, String nombre, String direccion, String telefono, String email,
                Ciudad ciudad, Usuario usuario, String descripcion, Integer estrellas,
                String politicaCancelacion, LocalTime checkIn, LocalTime checkOut, String imagenUrl,
                LocalDateTime createdAt, LocalDateTime updatedAt, List<Habitacion> habitaciones,
                List<Resena> resenas) {
        this.id = id;
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.email = email;
        this.ciudad = ciudad;
        this.usuario = usuario;
        this.descripcion = descripcion;
        this.estrellas = estrellas;
        this.politicaCancelacion = politicaCancelacion;
        this.checkIn = checkIn != null ? checkIn : LocalTime.of(15, 0);
        this.checkOut = checkOut != null ? checkOut : LocalTime.of(12, 0);
        this.imagenUrl = imagenUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.habitaciones = habitaciones;
        this.resenas = resenas;
    }
    
    // Getters
    public Integer getId() {
        return id;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public String getDireccion() {
        return direccion;
    }
    
    public String getTelefono() {
        return telefono;
    }
    
    public String getEmail() {
        return email;
    }
    
    public Ciudad getCiudad() {
        return ciudad;
    }
    
    public Usuario getUsuario() {
        return usuario;
    }
    
    public String getDescripcion() {
        return descripcion;
    }
    
    public Integer getEstrellas() {
        return estrellas;
    }
    
    public String getPoliticaCancelacion() {
        return politicaCancelacion;
    }
    
    public LocalTime getCheckIn() {
        return checkIn;
    }
    
    public LocalTime getCheckOut() {
        return checkOut;
    }
    
    public String getImagenUrl() {
        return imagenUrl;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public List<Habitacion> getHabitaciones() {
        return habitaciones;
    }
    
    public List<Resena> getResenas() {
        return resenas;
    }
    
    // Setters
    public void setId(Integer id) {
        this.id = id;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
    
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public void setCiudad(Ciudad ciudad) {
        this.ciudad = ciudad;
    }
    
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public void setEstrellas(Integer estrellas) {
        this.estrellas = estrellas;
    }
    
    public void setPoliticaCancelacion(String politicaCancelacion) {
        this.politicaCancelacion = politicaCancelacion;
    }
    
    public void setCheckIn(LocalTime checkIn) {
        this.checkIn = checkIn != null ? checkIn : LocalTime.of(15, 0);
    }
    
    public void setCheckOut(LocalTime checkOut) {
        this.checkOut = checkOut != null ? checkOut : LocalTime.of(12, 0);
    }
    
    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public void setHabitaciones(List<Habitacion> habitaciones) {
        this.habitaciones = habitaciones;
    }
    
    public void setResenas(List<Resena> resenas) {
        this.resenas = resenas;
    }
    
    // Métodos equals y hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Hotel)) return false;
        Hotel hotel = (Hotel) o;
        return id != null && id.equals(hotel.id);
    }
    
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
    
    // Método toString
    @Override
    public String toString() {
        return "Hotel{id=" + id + ", nombre='" + nombre + '\'' +
                ", direccion='" + direccion + '\'' + ", telefono='" + telefono + '\'' +
                ", email='" + email + '\'' + ", ciudad=" + ciudad +
                ", usuario=" + usuario + ", descripcion='" + descripcion + '\'' +
                ", estrellas=" + estrellas + ", politicaCancelacion='" + politicaCancelacion + '\'' +
                ", checkIn=" + checkIn + ", checkOut=" + checkOut +
                ", imagenUrl='" + imagenUrl + '\'' + ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt + ", habitaciones=" + habitaciones +
                ", resenas=" + resenas + '}';
    }
}