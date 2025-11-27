package com.example.Back.Mapper;

import com.example.Back.Dto.UsuarioDTO;
import com.example.Back.Models.Usuario;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class UsuarioMapper {

    public UsuarioDTO toDTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setIdUsuario(usuario.getIdUsuario());
        dto.setNombreCompleto(usuario.getNombreCompleto());
        dto.setEmail(usuario.getEmail());
        dto.setTelefono(usuario.getTelefono());
        dto.setDocumento(usuario.getDocumento());
        dto.setEstado(usuario.getEstado());
        dto.setFotoUrl(usuario.getFotoUrl()); // Agregar el campo fotoUrl
        
        if (usuario.getRoles() != null) {
            dto.setRoles(usuario.getRoles().stream()
                    .map(role -> role.getName())
                    .collect(Collectors.toList()));
        }
        
        if (usuario.getFechaRegistro() != null) {
            dto.setFechaRegistro(usuario.getFechaRegistro().toString());
        }
        
        return dto;
    }
}