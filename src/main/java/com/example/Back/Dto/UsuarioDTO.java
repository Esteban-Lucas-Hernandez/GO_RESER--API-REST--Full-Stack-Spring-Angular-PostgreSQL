package com.example.Back.Dto;

import java.util.List;

public class UsuarioDTO {
    private Integer idUsuario;
    private String nombreCompleto;
    private String email;
    private String telefono;
    private String documento;
    private List<String> roles;
    private Boolean estado;
    private String fechaRegistro;
    private String fotoUrl;
    
    // Constructor por defecto
    public UsuarioDTO() {}
    
    // Constructor con parámetros
    public UsuarioDTO(Integer idUsuario, String nombreCompleto, String email, String telefono, String documento, List<String> roles, Boolean estado, String fechaRegistro, String fotoUrl) {
        this.idUsuario = idUsuario;
        this.nombreCompleto = nombreCompleto;
        this.email = email;
        this.telefono = telefono;
        this.documento = documento;
        this.roles = roles;
        this.estado = estado;
        this.fechaRegistro = fechaRegistro;
        this.fotoUrl = fotoUrl;
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
    
    public List<String> getRoles() {
        return roles;
    }
    
    public Boolean getEstado() {
        return estado;
    }
    
    public String getFechaRegistro() {
        return fechaRegistro;
    }
    
    public String getFotoUrl() {
        return fotoUrl;
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
    
    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
    
    public void setEstado(Boolean estado) {
        this.estado = estado;
    }
    
    public void setFechaRegistro(String fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }
    
    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }
    
    // Método toString
    @Override
    public String toString() {
        return "UsuarioDTO{idUsuario=" + idUsuario + ", nombreCompleto='" + nombreCompleto + '\'' +
                ", email='" + email + '\'' + ", telefono='" + telefono + '\'' +
                ", documento='" + documento + '\'' + ", roles=" + roles +
                ", estado=" + estado + ", fechaRegistro='" + fechaRegistro + '\'' +
                ", fotoUrl='" + fotoUrl + '\'' + '}';
    }
}