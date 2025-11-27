package com.example.Back.Dto;

import lombok.Data;
import java.util.List;

@Data
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
}