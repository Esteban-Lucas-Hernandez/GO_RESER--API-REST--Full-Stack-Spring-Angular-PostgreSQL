package com.example.Back.Models;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "usuarios")
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
    private Set<Role> roles = new HashSet<>();

    @Column(nullable = false)
    private String contrasena;

    @Column(nullable = false)
    private Boolean estado = true;

    private java.sql.Timestamp fechaRegistro = new java.sql.Timestamp(System.currentTimeMillis());
    
    // Constructor por defecto
    public Usuario() {}
    
    // Constructor con parámetros
    public Usuario(Integer idUsuario, String nombreCompleto, String email, String telefono, 
                  String documento, String fotoUrl, Set<Role> roles, String contrasena, 
                  Boolean estado, java.sql.Timestamp fechaRegistro) {
        this.idUsuario = idUsuario;
        this.nombreCompleto = nombreCompleto;
        this.email = email;
        this.telefono = telefono;
        this.documento = documento;
        this.fotoUrl = fotoUrl;
        this.roles = roles != null ? roles : new HashSet<>();
        this.contrasena = contrasena;
        this.estado = estado != null ? estado : true;
        this.fechaRegistro = fechaRegistro != null ? fechaRegistro : new java.sql.Timestamp(System.currentTimeMillis());
    }
    
    // Getters
    public Integer getIdUsuario() {
        return idUsuario;
    }
    
    public String getNombreCompleto() {
        return nombreCompleto;
    }
    
    public String getEmail() {
        return email;
    }
    
    public String getTelefono() {
        return telefono;
    }
    
    public String getDocumento() {
        return documento;
    }
    
    public String getFotoUrl() {
        return fotoUrl;
    }
    
    public Set<Role> getRoles() {
        return roles;
    }
    
    public String getContrasena() {
        return contrasena;
    }
    
    public Boolean getEstado() {
        return estado;
    }
    
    public java.sql.Timestamp getFechaRegistro() {
        return fechaRegistro;
    }
    
    // Setters
    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }
    
    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
    
    public void setDocumento(String documento) {
        this.documento = documento;
    }
    
    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }
    
    public void setRoles(Set<Role> roles) {
        this.roles = roles != null ? roles : new HashSet<>();
    }
    
    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }
    
    public void setEstado(Boolean estado) {
        this.estado = estado != null ? estado : true;
    }
    
    public void setFechaRegistro(java.sql.Timestamp fechaRegistro) {
        this.fechaRegistro = fechaRegistro != null ? fechaRegistro : new java.sql.Timestamp(System.currentTimeMillis());
    }
    
    // Métodos equals y hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Usuario)) return false;
        Usuario usuario = (Usuario) o;
        return idUsuario != null && idUsuario.equals(usuario.idUsuario);
    }
    
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
    
    // Método toString
    @Override
    public String toString() {
        return "Usuario{idUsuario=" + idUsuario + ", nombreCompleto='" + nombreCompleto + '\'' +
                ", email='" + email + '\'' + ", telefono='" + telefono + '\'' +
                ", documento='" + documento + '\'' + ", fotoUrl='" + fotoUrl + '\'' +
                ", roles=" + roles + ", contrasena='" + contrasena + '\'' +
                ", estado=" + estado + ", fechaRegistro=" + fechaRegistro + '}';
    }
}