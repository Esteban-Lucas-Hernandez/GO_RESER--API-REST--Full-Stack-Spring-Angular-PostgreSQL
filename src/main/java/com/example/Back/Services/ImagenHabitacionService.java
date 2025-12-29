package com.example.Back.Services;

import com.example.Back.Dto.ImagenHabitacionDTO;
import com.example.Back.Mapper.ImagenHabitacionMapper;
import com.example.Back.Models.Habitacion;
import com.example.Back.Models.ImagenHabitacion;
import com.example.Back.Models.Usuario;
import com.example.Back.Repo.HabitacionRepository;
import com.example.Back.Repo.HotelRepository;
import com.example.Back.Repo.ImagenHabitacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ImagenHabitacionService {

    @Autowired
    private ImagenHabitacionRepository imagenHabitacionRepository;

    @Autowired
    private HabitacionRepository habitacionRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private SecurityService securityService;

    @Autowired
    private ImagenHabitacionMapper imagenHabitacionMapper;

    // Obtener todas las imágenes de una habitación, validando que la habitación pertenezca al hotel del usuario
    public List<ImagenHabitacionDTO> getImagenesByHabitacionId(Integer hotelId, Integer habitacionId) {
        Usuario currentUser = securityService.getCurrentUser();
        if (currentUser == null) {
            return List.of();
        }

        // Verificar que el hotel pertenece al usuario actual
        if (!hotelRepository.existsByIdAndUsuarioIdUsuario(hotelId, currentUser.getIdUsuario())) {
            return List.of();
        }

        // Verificar que la habitación pertenece al hotel
        if (!habitacionRepository.existsByIdHabitacionAndHotelId(habitacionId, hotelId)) {
            return List.of();
        }

        // Obtener las imágenes de la habitación que pertenece al hotel del usuario
        List<ImagenHabitacion> imagenes = imagenHabitacionRepository.findByHabitacionIdAndHotelId(habitacionId, hotelId);
        return imagenes.stream()
                .map(imagenHabitacionMapper::imagenHabitacionToImagenHabitacionDTO)
                .collect(Collectors.toList());
    }

    // Crear una nueva imagen para una habitación, validando que la habitación pertenezca al hotel del usuario
    public ImagenHabitacionDTO createImagen(Integer hotelId, Integer habitacionId, ImagenHabitacionDTO imagenDTO) {
        Usuario currentUser = securityService.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("Usuario no autenticado");
        }

        // Verificar que el hotel pertenece al usuario actual
        if (!hotelRepository.existsByIdAndUsuarioIdUsuario(hotelId, currentUser.getIdUsuario())) {
            throw new RuntimeException("Hotel no encontrado o no pertenece al usuario");
        }

        // Verificar que la habitación pertenece al hotel
        Habitacion habitacion = habitacionRepository.findByIdHabitacionAndHotelId(habitacionId, hotelId)
                .orElseThrow(() -> new RuntimeException("Habitación no encontrada o no pertenece al hotel"));

        // Crear la imagen
        ImagenHabitacion imagen = new ImagenHabitacion();
        imagen.setHabitacion(habitacion);
        imagen.setUrlImagen(imagenDTO.getUrlImagen());

        // Guardar la imagen
        ImagenHabitacion savedImagen = imagenHabitacionRepository.save(imagen);

        // Convertir a DTO
        return imagenHabitacionMapper.imagenHabitacionToImagenHabitacionDTO(savedImagen);
    }

    // Eliminar una imagen de una habitación, validando que la habitación pertenezca al hotel del usuario
    public boolean deleteImagen(Integer hotelId, Integer habitacionId, Integer imagenId) {
        Usuario currentUser = securityService.getCurrentUser();
        if (currentUser == null) {
            return false;
        }

        // Verificar que el hotel pertenece al usuario actual
        if (!hotelRepository.existsByIdAndUsuarioIdUsuario(hotelId, currentUser.getIdUsuario())) {
            return false;
        }

        // Verificar que la imagen pertenece a la habitación y que la habitación pertenece al hotel
        return imagenHabitacionRepository.findByIdAndHabitacionIdAndHotelId(imagenId, habitacionId, hotelId)
                .map(imagen -> {
                    imagenHabitacionRepository.delete(imagen);
                    return true;
                })
                .orElse(false);
    }
}