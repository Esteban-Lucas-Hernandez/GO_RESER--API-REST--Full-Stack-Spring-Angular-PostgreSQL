package com.example.Back.Services;

import com.example.Back.Dto.CategoriaHabitacionDTO;
import com.example.Back.Mapper.CategoriaHabitacionMapper;
import com.example.Back.Models.CategoriaHabitacion;
import com.example.Back.Models.Usuario;
import com.example.Back.Repo.CategoriaHabitacionRepository;
import com.example.Back.Repo.HabitacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoriaHabitacionService {

    @Autowired
    private CategoriaHabitacionRepository categoriaHabitacionRepository;
    
    @Autowired
    private HabitacionRepository habitacionRepository;

    @Autowired
    private SecurityService securityService;

    @Autowired
    private CategoriaHabitacionMapper categoriaHabitacionMapper;

    public List<CategoriaHabitacionDTO> obtenerCategoriasPorUsuario() {
        Usuario currentUser = securityService.getCurrentUser();
        if (currentUser != null) {
            List<CategoriaHabitacion> categorias = categoriaHabitacionRepository.findByUsuarioIdUsuario(currentUser.getIdUsuario());
            return categorias.stream()
                    .map(categoriaHabitacionMapper::categoriaHabitacionToCategoriaHabitacionDTO)
                    .collect(Collectors.toList());
        }
        return List.of();
    }

    public Optional<CategoriaHabitacionDTO> obtenerCategoriaPorId(Integer categoriaId) {
        Usuario currentUser = securityService.getCurrentUser();
        if (currentUser == null) {
            return Optional.empty();
        }

        // Verificar que la categoría pertenece al usuario actual
        Optional<CategoriaHabitacion> categoriaOpt = categoriaHabitacionRepository
                .findByIdAndUsuarioIdUsuario(categoriaId, currentUser.getIdUsuario());
        
        return categoriaOpt.map(categoriaHabitacionMapper::categoriaHabitacionToCategoriaHabitacionDTO);
    }

    public CategoriaHabitacionDTO crearCategoriaParaUsuario(CategoriaHabitacionDTO categoriaDTO) {
        // Obtener el usuario actual
        Usuario usuario = securityService.getCurrentUser();
        if (usuario == null) {
            throw new RuntimeException("Usuario no autenticado");
        }

        // Convertir DTO a entidad
        CategoriaHabitacion categoria = categoriaHabitacionMapper.categoriaHabitacionDTOToCategoriaHabitacion(categoriaDTO);
        categoria.setUsuario(usuario);

        // Guardar la categoría
        CategoriaHabitacion categoriaGuardada = categoriaHabitacionRepository.save(categoria);

        // Convertir entidad guardada a DTO
        return categoriaHabitacionMapper.categoriaHabitacionToCategoriaHabitacionDTO(categoriaGuardada);
    }

    public CategoriaHabitacionDTO actualizarCategoriaDeUsuario(Integer categoriaId, CategoriaHabitacionDTO categoriaDTO) {
        // Obtener el usuario actual
        Usuario usuario = securityService.getCurrentUser();
        if (usuario == null) {
            throw new RuntimeException("Usuario no autenticado");
        }

        // Verificar que la categoría pertenezca al usuario
        CategoriaHabitacion categoriaExistente = categoriaHabitacionRepository
                .findByIdAndUsuarioIdUsuario(categoriaId, usuario.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada o no pertenece al usuario"));

        // Actualizar los campos
        categoriaExistente.setNombre(categoriaDTO.getNombre());
        categoriaExistente.setDescripcion(categoriaDTO.getDescripcion());

        // Guardar cambios
        CategoriaHabitacion categoriaActualizada = categoriaHabitacionRepository.save(categoriaExistente);

        // Convertir a DTO
        return categoriaHabitacionMapper.categoriaHabitacionToCategoriaHabitacionDTO(categoriaActualizada);
    }

    // Método modificado para verificar relaciones antes de eliminar
    public void eliminarCategoriaDeUsuario(Integer categoriaId) throws RuntimeException {
        // Obtener el usuario actual
        Usuario usuario = securityService.getCurrentUser();
        if (usuario == null) {
            throw new RuntimeException("Usuario no autenticado");
        }

        // Verificar que la categoría pertenezca al usuario
        CategoriaHabitacion categoriaExistente = categoriaHabitacionRepository
                .findByIdAndUsuarioIdUsuario(categoriaId, usuario.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada o no pertenece al usuario"));

        // Verificar si existen habitaciones asociadas a esta categoría
        long habitacionesAsociadas = habitacionRepository.countByCategoriaId(categoriaId);
        if (habitacionesAsociadas > 0) {
            throw new RuntimeException("No se puede eliminar la categoría porque está asociada a " + habitacionesAsociadas + " habitacion(es) por favor cambie de categoria la habitacion");
        }

        // Eliminar la categoría
        categoriaHabitacionRepository.delete(categoriaExistente);
    }
}