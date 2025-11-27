package com.example.Back.Models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categorias_habitacion")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
}