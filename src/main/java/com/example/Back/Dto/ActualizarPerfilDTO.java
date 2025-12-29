package com.example.Back.Dto;

public class ActualizarPerfilDTO {
    private String nombreCompleto;
    private String telefono;
    private String documento;
    private String email;
    private String contrasena;
    private String fotoUrl;
    
    // Constructor por defecto
    public ActualizarPerfilDTO() {}
    
    // Constructor con parámetros
    public ActualizarPerfilDTO(String nombreCompleto, String telefono, String documento, 
                          String email, String contrasena, String fotoUrl) {
        this.nombreCompleto = nombreCompleto;
        this.telefono = telefono;
        this.documento = documento;
        this.email = email;
        this.contrasena = contrasena;
        this.fotoUrl = fotoUrl;
    }
    
    // Getters
    public String getNombreCompleto() {
        return nombreCompleto;
    }
    
    public String getTelefono() {
        return telefono;
    }
    
    public String getDocumento() {
        return documento;
    }
    
    public String getEmail() {
        return email;
    }
    
    public String getContrasena() {
        return contrasena;
    }
    
    public String getFotoUrl() {
        return fotoUrl;
    }
    
    // Setters
    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }
    
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
    
    public void setDocumento(String documento) {
        this.documento = documento;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }
    
    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }
    
    // Método toString
    @Override
    public String toString() {
        return "ActualizarPerfilDTO{nombreCompleto='" + nombreCompleto + '\'' +
                ", telefono='" + telefono + '\'' + ", documento='" + documento + '\'' +
                ", email='" + email + '\'' + ", contrasena='" + contrasena + '\'' +
                ", fotoUrl='" + fotoUrl + '\'' + '}';
    }
}