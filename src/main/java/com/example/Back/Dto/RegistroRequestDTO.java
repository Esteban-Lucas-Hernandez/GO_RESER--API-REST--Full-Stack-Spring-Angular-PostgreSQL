package com.example.Back.Dto;

public class RegistroRequestDTO {
    private String nombreCompleto;
    private String email;
    private String telefono;
    private String documento;
    private String contrasena;
    private String fotoUrl;
    
    // Constructor por defecto
    public RegistroRequestDTO() {}
    
    // Constructor con parámetros
    public RegistroRequestDTO(String nombreCompleto, String email, String telefono, 
                           String documento, String contrasena, String fotoUrl) {
        this.nombreCompleto = nombreCompleto;
        this.email = email;
        this.telefono = telefono;
        this.documento = documento;
        this.contrasena = contrasena;
        this.fotoUrl = fotoUrl;
    }
    
    // Getters
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
    
    // Setters
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
    
    // Método toString
    @Override
    public String toString() {
        return "RegistroRequestDTO{nombreCompleto='" + nombreCompleto + '\'' +
                ", email='" + email + '\'' + ", telefono='" + telefono + '\'' +
                ", documento='" + documento + '\'' + ", contrasena='" + contrasena + '\'' +
                ", fotoUrl='" + fotoUrl + '\'' + '}';
    }
}