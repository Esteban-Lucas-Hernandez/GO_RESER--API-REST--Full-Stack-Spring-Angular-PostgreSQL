package com.example.Back.Controllers.User;

import com.example.Back.Dto.UsuarioDTO;
import com.example.Back.Dto.ActualizarPerfilDTO;
import com.example.Back.Models.Usuario;
import com.example.Back.Services.SecurityService;
import com.example.Back.Mapper.UsuarioMapper;
import com.example.Back.Repo.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user/profile")
public class UsuarioController {

    @Autowired
    private SecurityService securityService;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private UsuarioMapper usuarioMapper;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    // Obtener información del usuario actual
    @GetMapping
    public ResponseEntity<UsuarioDTO> getProfile() {
        try {
            Usuario usuario = securityService.getCurrentUser();
            if (usuario == null) {
                return ResponseEntity.notFound().build();
            }
            UsuarioDTO usuarioDTO = usuarioMapper.toDTO(usuario);
            return ResponseEntity.ok(usuarioDTO);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // Actualizar información del usuario
    @PutMapping
    public ResponseEntity<UsuarioDTO> updateProfile(@RequestBody ActualizarPerfilDTO actualizarPerfilDTO) {
        try {
            Usuario usuario = securityService.getCurrentUser();
            if (usuario == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Actualizar campos permitidos
            if (actualizarPerfilDTO.getNombreCompleto() != null) {
                usuario.setNombreCompleto(actualizarPerfilDTO.getNombreCompleto());
            }
            
            if (actualizarPerfilDTO.getTelefono() != null) {
                usuario.setTelefono(actualizarPerfilDTO.getTelefono());
            }
            
            if (actualizarPerfilDTO.getDocumento() != null) {
                usuario.setDocumento(actualizarPerfilDTO.getDocumento());
            }
            
            // Actualizar fotoUrl si se proporciona
            if (actualizarPerfilDTO.getFotoUrl() != null) {
                usuario.setFotoUrl(actualizarPerfilDTO.getFotoUrl());
            }
            
            // Actualizar email si se proporciona
            if (actualizarPerfilDTO.getEmail() != null && !actualizarPerfilDTO.getEmail().isEmpty()) {
                // Verificar que el email no esté ya en uso por otro usuario
                if (!usuario.getEmail().equals(actualizarPerfilDTO.getEmail())) {
                    if (usuarioRepository.findByEmail(actualizarPerfilDTO.getEmail()).isPresent()) {
                        return ResponseEntity.badRequest().build();
                    }
                    usuario.setEmail(actualizarPerfilDTO.getEmail());
                }
            }
            
            // Actualizar contraseña si se proporciona
            if (actualizarPerfilDTO.getContrasena() != null && !actualizarPerfilDTO.getContrasena().isEmpty()) {
                usuario.setContrasena(passwordEncoder.encode(actualizarPerfilDTO.getContrasena()));
            }
            
            Usuario updatedUsuario = usuarioRepository.save(usuario);
            UsuarioDTO updatedDTO = usuarioMapper.toDTO(updatedUsuario);
            return ResponseEntity.ok(updatedDTO);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}