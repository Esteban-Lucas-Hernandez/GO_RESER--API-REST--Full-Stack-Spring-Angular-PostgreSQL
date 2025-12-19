package com.example.Back.Dto;

import lombok.Data;

@Data
public class RegistroRequestDTO {
    private String nombreCompleto;
    private String email;
    private String telefono;
    private String documento;
    private String contrasena;
    private String fotoUrl;
    
    // Getters explícitos como fallback
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
    
    public String getContrasena() {
        return contrasena;
    }
    
    public String getFotoUrl() {
        return fotoUrl;
    }
    
    // Setters explícitos como fallback
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
    
    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }
    
    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }
}