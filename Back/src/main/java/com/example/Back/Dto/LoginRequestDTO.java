package com.example.Back.Dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequestDTO {

    @Email(message = "Debe ser un email válido")
    @NotBlank(message = "Email obligatorio")
    private String email;

    @NotBlank(message = "Contraseña obligatoria")
    private String password;
}
