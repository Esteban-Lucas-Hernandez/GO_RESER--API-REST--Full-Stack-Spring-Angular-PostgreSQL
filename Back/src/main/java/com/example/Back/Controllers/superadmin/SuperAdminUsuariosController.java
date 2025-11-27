package com.example.Back.Controllers.superadmin;

import com.example.Back.Dto.UsuarioDTO;
import com.example.Back.Models.Usuario;
import com.example.Back.Services.SuperAdminService;
import com.example.Back.Services.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/superadmin/usuarios")
@RequiredArgsConstructor
public class SuperAdminUsuariosController {

    private final SuperAdminService superAdminService;
    private final EmailService emailService;

    @GetMapping
    @PreAuthorize("hasRole('SUPERADMIN')")
    public ResponseEntity<List<UsuarioDTO>> listarUsuarios() {
        return ResponseEntity.ok(superAdminService.listarUsuarios());
    }

    @PutMapping("/{idUsuario}/roles")
    @PreAuthorize("hasRole('SUPERADMIN')")
    public ResponseEntity<UsuarioDTO> actualizarRoles(
            @PathVariable Integer idUsuario,
            @RequestBody Map<String, List<String>> body
    ) {
        List<String> roles = body.get("roles");
        return ResponseEntity.ok(superAdminService.actualizarRoles(idUsuario, roles));
    }

    @PatchMapping("/{idUsuario}/estado")
    @PreAuthorize("hasRole('SUPERADMIN')")
    public ResponseEntity<UsuarioDTO> cambiarEstadoUsuario(
            @PathVariable Integer idUsuario,
            @RequestParam Boolean estado
    ) {
        return ResponseEntity.ok(superAdminService.cambiarEstadoUsuario(idUsuario, estado));
    }

    @DeleteMapping("/{idUsuario}")
    @PreAuthorize("hasRole('SUPERADMIN')")
    public ResponseEntity<String> eliminarUsuario(@PathVariable Integer idUsuario) {
        // Obtener usuario antes de eliminarlo
        Usuario usuario = superAdminService.obtenerUsuarioPorId(idUsuario);

        String correo = usuario.getEmail();
        String nombre = usuario.getNombreCompleto();

        // Eliminar usuario
        superAdminService.eliminarUsuario(idUsuario);

        // Enviar correo
        emailService.enviarCorreo(
              correo,
              "Cuenta eliminada",
              "Hola " + nombre + ", tu cuenta ha sido eliminada por el administrador porque ah violado nuestras leyes y politicas\n\natt: GO RESER."
        );

        return ResponseEntity.ok("Usuario eliminado y correo enviado");
    }
}