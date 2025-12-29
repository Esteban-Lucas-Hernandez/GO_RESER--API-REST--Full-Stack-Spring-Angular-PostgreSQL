package com.example.Back.Services;

import com.example.Back.Dto.ResenaDTO;
import com.example.Back.Mapper.ResenaMapper;
import com.example.Back.Models.Resena;
import com.example.Back.Models.Usuario;
import com.example.Back.Models.Hotel;
import com.example.Back.Repo.ResenaRepository;
import com.example.Back.Repo.HotelRepository;
import com.example.Back.Repo.UsuarioRepository;
import com.example.Back.Repo.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.stream.Stream;

@Service
public class ResenaService {
    private static final Logger logger = LoggerFactory.getLogger(ResenaService.class);

    @Autowired
    private ResenaRepository resenaRepository;
    
    @Autowired
    private HotelRepository hotelRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private ReservaRepository reservaRepository;
    
    @Autowired
    private ResenaMapper resenaMapper;
    
    @Autowired
    private SecurityService securityService;

    // Obtener todas las reseñas de un hotel específico
    public List<ResenaDTO> obtenerResenasPorHotel(Integer hotelId) {
        List<Resena> resenas = resenaRepository.findByHotelId(hotelId);
        return resenas.stream()
                .map(resenaMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    // Obtener todas las reseñas de todos los hoteles
    public List<ResenaDTO> obtenerTodasLasResenas() {
        List<Resena> resenas = resenaRepository.findAll();
        return resenas.stream()
                .map(resenaMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Obtener todas las reseñas de un usuario específico
    public List<ResenaDTO> obtenerResenasPorUsuario(Integer idUsuario) {
        List<Resena> resenas = resenaRepository.findByUsuarioIdUsuario(idUsuario);
        return resenas.stream()
                .map(resenaMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Obtener una reseña específica por ID
    public Optional<ResenaDTO> obtenerResenaPorId(Integer id) {
        return resenaRepository.findById(id)
                .map(resenaMapper::toDTO);
    }

    // Crear una nueva reseña
    public ResenaDTO crearResena(ResenaDTO resenaDTO, Integer hotelId) throws Exception {
        logger.info("Iniciando creación de reseña para hotel ID: {}", hotelId);
        try {
            // Obtener el usuario autenticado
            Usuario usuario = securityService.getAuthenticatedUser();
            logger.info("Usuario autenticado: {}", usuario != null ? usuario.getEmail() : "null");
            
            // Verificar que el usuario esté registrado
            if (usuario == null) {
                logger.error("Usuario no autenticado");
                throw new RuntimeException("Usuario no autenticado");
            }
            
            // Verificar que el hotel exista
            Hotel hotel = hotelRepository.findById(hotelId)
                    .orElseThrow(() -> {
                        logger.error("Hotel no encontrado con ID: {}", hotelId);
                        return new RuntimeException("Hotel no encontrado");
                    });
            logger.info("Hotel encontrado: ID={}", hotel.getId());
            
            // Verificar que el usuario tenga al menos una reserva confirmada en ese hotel
            boolean tieneReservaConfirmada = resenaRepository.hasConfirmedReservation(usuario, hotel);
            if (!tieneReservaConfirmada) {
                logger.error("El usuario no tiene ninguna reserva confirmada en este hotel");
                throw new Exception("El usuario no tiene ninguna reserva confirmada en este hotel");
            }
            
            // Verificar que el usuario no haya dejado ya una reseña para este hotel
            Optional<Resena> resenaExistente = resenaRepository.findByUsuarioAndHotel(usuario, hotel);
            if (resenaExistente.isPresent()) {
                logger.error("El usuario ya ha dejado una reseña para este hotel");
                throw new Exception("El usuario ya ha dejado una reseña para este hotel");
            }
            
            // Convertir DTO a entidad
            Resena resena = resenaMapper.toEntity(resenaDTO);
            
            // Asignar usuario y hotel a la reseña
            resena.setUsuario(usuario);
            resena.setHotel(hotel);
            
            // Guardar la reseña
            Resena nuevaResena = resenaRepository.save(resena);
            logger.info("Reseña guardada con ID: {}", nuevaResena.getIdResena());
            return resenaMapper.toDTO(nuevaResena);
        } catch (Exception e) {
            logger.error("Error al crear reseña: {}", e.getMessage(), e);
            throw e;
        }
    }

    // Actualizar una reseña existente
    public ResenaDTO actualizarResena(Integer id, ResenaDTO resenaDTO) throws Exception {
        logger.info("Iniciando actualización de reseña ID: {}", id);
        try {
            // Obtener el usuario autenticado
            Usuario usuario = securityService.getAuthenticatedUser();
            if (usuario == null) {
                logger.error("Usuario no autenticado al actualizar reseña");
                throw new RuntimeException("Usuario no autenticado");
            }
            logger.info("Usuario autenticado para actualizar reseña: {}", usuario.getEmail());
            
            Resena resenaExistente = resenaRepository.findById(id)
                    .orElseThrow(() -> {
                        logger.error("Reseña no encontrada con ID: {}", id);
                        return new Exception("Reseña no encontrada");
                    });
            
            // Verificar que el usuario sea el propietario de la reseña
            if (!resenaExistente.getUsuario().getIdUsuario().equals(usuario.getIdUsuario())) {
                logger.error("No tienes permiso para actualizar esta reseña");
                throw new Exception("No tienes permiso para actualizar esta reseña");
            }
            
            // Actualizar campos
            resenaExistente.setComentario(resenaDTO.getComentario());
            resenaExistente.setCalificacion(resenaDTO.getCalificacion());
            
            Resena resenaActualizada = resenaRepository.save(resenaExistente);
            logger.info("Reseña actualizada con ID: {}", resenaActualizada.getIdResena());
            return resenaMapper.toDTO(resenaActualizada);
        } catch (Exception e) {
            logger.error("Error al actualizar reseña: {}", e.getMessage(), e);
            throw e;
        }
    }

    // Eliminar una reseña
    public void eliminarResena(Integer id) throws Exception {
        logger.info("Iniciando eliminación de reseña ID: {}", id);
        try {
            // Obtener el usuario autenticado
            Usuario usuario = securityService.getAuthenticatedUser();
            if (usuario == null) {
                logger.error("Usuario no autenticado al eliminar reseña");
                throw new RuntimeException("Usuario no autenticado");
            }
            logger.info("Usuario autenticado para eliminar reseña: {}", usuario.getEmail());
            
            Resena resena = resenaRepository.findById(id)
                    .orElseThrow(() -> {
                        logger.error("Reseña no encontrada con ID: {}", id);
                        return new Exception("Reseña no encontrada");
                    });
            
            // Verificar que el usuario sea el propietario de la reseña
            if (!resena.getUsuario().getIdUsuario().equals(usuario.getIdUsuario())) {
                logger.error("No tienes permiso para eliminar esta reseña");
                throw new Exception("No tienes permiso para eliminar esta reseña");
            }
            
            resenaRepository.deleteById(id);
            logger.info("Reseña eliminada con ID: {}", id);
        } catch (Exception e) {
            logger.error("Error al eliminar reseña: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Obtener todas las reseñas de todos los hoteles del usuario actual
     */
    public List<ResenaDTO> getResenasDeMisHoteles() {
        logger.info("Iniciando obtención de reseñas de todos los hoteles del usuario actual");
        try {
            // Obtener el usuario autenticado
            Usuario usuario = securityService.getAuthenticatedUser();
            if (usuario == null) {
                logger.error("Usuario no autenticado al obtener reseñas de mis hoteles");
                throw new RuntimeException("Usuario no autenticado");
            }
            
            // Obtener todos los hoteles del usuario
            List<Hotel> hoteles = hotelRepository.findByUsuario(usuario);
            
            // Obtener todas las reseñas de todos los hoteles del usuario
            List<Resena> todasLasResenas = hoteles.stream()
                .flatMap(hotel -> resenaRepository.findByHotelId(hotel.getId()).stream())
                .collect(Collectors.toList());
            
            logger.info("Se encontraron {} reseñas en total de mis hoteles", todasLasResenas.size());
            
            // Convertir a DTOs
            return todasLasResenas.stream()
                    .map(resenaMapper::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error al obtener reseñas de mis hoteles: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Obtener todas las reseñas de un hotel específico que pertenece al usuario actual
     */
    public List<ResenaDTO> getResenasPorHotelDeUsuario(Integer idHotel) {
        logger.info("Iniciando obtención de reseñas por hotel ID: {} del usuario actual", idHotel);
        try {
            // Obtener el usuario autenticado
            Usuario usuario = securityService.getAuthenticatedUser();
            if (usuario == null) {
                logger.error("Usuario no autenticado al obtener reseñas por hotel");
                throw new RuntimeException("Usuario no autenticado");
            }
            
            // Verificar que el hotel pertenece al usuario actual
            Optional<Hotel> hotelOpt = hotelRepository.findByIdAndUsuarioIdUsuario(idHotel, usuario.getIdUsuario());
            if (!hotelOpt.isPresent()) {
                logger.error("Hotel no encontrado o no pertenece al usuario actual: {}", idHotel);
                throw new RuntimeException("Hotel no encontrado o no pertenece al usuario actual");
            }
            
            // Obtener todas las reseñas del hotel
            List<Resena> resenas = resenaRepository.findByHotelId(idHotel);
            
            logger.info("Se encontraron {} reseñas para el hotel {}", resenas.size(), idHotel);
            
            // Convertir a DTOs
            return resenas.stream()
                    .map(resenaMapper::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error al obtener reseñas por hotel de usuario: {}", e.getMessage(), e);
            throw e;
        }
    }
}