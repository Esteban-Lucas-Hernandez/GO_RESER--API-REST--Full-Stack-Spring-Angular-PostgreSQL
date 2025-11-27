package com.example.Back.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoogleLoginResponseDTO {
    private boolean success;
    private String message;
    private String token;
    private Integer userId;
    private String fullName;
    private String email;
    private String fotoUrl;
}