package com.example.Back.Models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "hoteles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
}