package com.example.Back.Models;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idUsuario;

    @Column(nullable = false)
    private String nombreCompleto;

    @Column(unique = true, nullable = false)
    private String email;

    private String telefono;

    private String documento;

    // Nuevo campo para la URL de la foto de perfil
    private String fotoUrl;

    // Relación con la tabla de roles
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "usuario_roles",
            joinColumns = @JoinColumn(name = "usuario_id"),
            inverseJoinColumns = @JoinColumn(name = "rol_id")
    )
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    @Column(nullable = false)
    private String contrasena;

    @Builder.Default
    @Column(nullable = false)
    private Boolean estado = true;

    @Builder.Default
    private java.sql.Timestamp fechaRegistro = new java.sql.Timestamp(System.currentTimeMillis());
}