package com.example.Back.Dto;

public class LoginResponseDTO {
    private boolean success;
    private String message;
    private String token;
    private Integer userId;
    private String username;
    private String email;
    
    // Constructor por defecto
    public LoginResponseDTO() {}
    
    // Constructor con parámetros
    public LoginResponseDTO(boolean success, String message, String token, Integer userId, String username, String email) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.email = email;
    }
    
    // Getters
    public boolean isSuccess() {
        return success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public String getToken() {
        return token;
    }
    
    public Integer getUserId() {
        return userId;
    }
    
    public String getUsername() {
        return username;
    }
    
    public String getEmail() {
        return email;
    }
    
    // Setters
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public void setUserId(Integer userId) {
        this.userId = userId;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    // Método toString
    @Override
    public String toString() {
        return "LoginResponseDTO{success=" + success + ", message='" + message + '\'' +
                ", token='" + token + '\'' + ", userId=" + userId + ", username='" + username + '\'' +
                ", email='" + email + '\'' + '}';
    }
}