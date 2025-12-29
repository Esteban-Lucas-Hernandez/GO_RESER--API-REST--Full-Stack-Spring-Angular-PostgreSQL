package com.example.Back.Dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequestDTO {

    @Email(message = "Debe ser un email válido")
    @NotBlank(message = "Email obligatorio")
    private String email;

    @NotBlank(message = "Contraseña obligatoria")
    private String password;
    
    // Constructor por defecto
    public LoginRequestDTO() {}
    
    // Constructor con parámetros
    public LoginRequestDTO(String email, String password) {
        this.email = email;
        this.password = password;
    }
    
    // Getters
    public String getEmail() {
        return email;
    }
    
    public String getPassword() {
        return password;
    }
    
    // Setters
    public void setEmail(String email) {
        this.email = email;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    // Método toString
    @Override
    public String toString() {
        return "LoginRequestDTO{email='" + email + '\'' + ", password='" + password + '\'' + '}';
    }
}
