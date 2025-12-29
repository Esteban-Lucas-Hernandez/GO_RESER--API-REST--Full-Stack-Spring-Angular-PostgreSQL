package com.example.Back.Dto;

public class GoogleLoginResponseDTO {
    private boolean success;
    private String message;
    private String token;
    private Integer userId;
    private String fullName;
    private String email;
    private String fotoUrl;
    
    // Constructor por defecto
    public GoogleLoginResponseDTO() {}
    
    // Constructor con parámetros
    public GoogleLoginResponseDTO(boolean success, String message, String token, 
                               Integer userId, String fullName, String email, String fotoUrl) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.fotoUrl = fotoUrl;
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
    
    public String getFullName() {
        return fullName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public String getFotoUrl() {
        return fotoUrl;
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
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }
    
    // Método toString
    @Override
    public String toString() {
        return "GoogleLoginResponseDTO{success=" + success + ", message='" + message + '\'' +
                ", token='" + token + '\'' + ", userId=" + userId + ", fullName='" + fullName + '\'' +
                ", email='" + email + '\'' + ", fotoUrl='" + fotoUrl + '\'' + '}';
    }
}