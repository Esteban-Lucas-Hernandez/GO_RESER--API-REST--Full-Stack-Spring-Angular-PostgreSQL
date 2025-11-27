package com.example.Back.Services;

import com.example.Back.Dto.CrearHabitacionDTO;
import com.example.Back.Dto.HabitacionDTO;
import com.example.Back.Mapper.HabitacionMapper;
import com.example.Back.Models.CategoriaHabitacion;
import com.example.Back.Models.Habitacion;
import com.example.Back.Models.Hotel;
import com.example.Back.Models.ImagenHabitacion;
import com.example.Back.Models.Usuario;
import com.example.Back.Models.Reserva;
import com.example.Back.Repo.CategoriaHabitacionRepository;
import com.example.Back.Repo.HabitacionRepository;
import com.example.Back.Repo.HotelRepository;
import com.example.Back.Repo.ImagenHabitacionRepository;
import com.example.Back.Repo.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

@Service
public class HabitacionService {

    @Autowired
    private HabitacionRepository habitacionRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private CategoriaHabitacionRepository categoriaHabitacionRepository;

    @Autowired
    private ImagenHabitacionRepository imagenHabitacionRepository;

    @Autowired
    private SecurityService securityService;

    @Autowired
    private HabitacionMapper habitacionMapper;

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private EmailService emailService;

    // Obtener todas las habitaciones de un hotel específico del usuario actual
    public List<HabitacionDTO> getHabitacionesByHotelId(Integer hotelId) {
        Usuario currentUser = securityService.getCurrentUser();
        if (currentUser == null) {
            return List.of();
        }

        // Verificar que el hotel pertenece al usuario actual
        Optional<Hotel> hotelOpt = hotelRepository.findByIdAndUsuarioIdUsuario(hotelId, currentUser.getIdUsuario());
        if (hotelOpt.isPresent()) {
            List<Habitacion> habitaciones = habitacionRepository.findByHotel(hotelOpt.get());
            return habitaciones.stream()
                    .map(habitacionMapper::habitacionToHabitacionDTO)
                    .collect(Collectors.toList());
        }
        return List.of();
    }

    // Obtener una habitación específica de un hotel del usuario actual
    public Optional<HabitacionDTO> getHabitacionByIdAndHotelId(Integer habitacionId, Integer hotelId) {
        Usuario currentUser = securityService.getCurrentUser();
        if (currentUser == null) {
            return Optional.empty();
        }

        // Verificar que el hotel pertenece al usuario actual
        Optional<Hotel> hotelOpt = hotelRepository.findByIdAndUsuarioIdUsuario(hotelId, currentUser.getIdUsuario());
        if (hotelOpt.isPresent()) {
            // Verificar que la habitación pertenece al hotel
            Optional<Habitacion> habitacionOpt = habitacionRepository.findByIdHabitacion(habitacionId);
            if (habitacionOpt.isPresent() && habitacionOpt.get().getHotel().getId().equals(hotelId)) {
                return Optional.of(habitacionMapper.habitacionToHabitacionDTO(habitacionOpt.get()));
            }
        }
        return Optional.empty();
    }

    // Obtener todas las habitaciones de todos los hoteles del usuario actual
    public List<HabitacionDTO> getHabitacionesDeMisHoteles() {
        // Obtener el usuario autenticado
        Usuario usuario = securityService.getAuthenticatedUser();
        if (usuario == null) {
            throw new RuntimeException("Usuario no autenticado");
        }
        
        // Obtener todos los hoteles del usuario
        List<Hotel> hoteles = hotelRepository.findByUsuario(usuario);
        
        // Obtener todas las habitaciones de todos los hoteles del usuario
        List<Habitacion> todasLasHabitaciones = hoteles.stream()
            .flatMap(hotel -> habitacionRepository.findByHotel(hotel).stream())
            .collect(Collectors.toList());
        
        // Convertir a DTOs
        return todasLasHabitaciones.stream()
                .map(habitacionMapper::habitacionToHabitacionDTO)
                .collect(Collectors.toList());
    }

    // Crear una nueva habitación para un hotel del usuario actual usando HabitacionDTO
    public Optional<HabitacionDTO> createHabitacion(Integer hotelId, HabitacionDTO habitacionDTO) {
        Usuario currentUser = securityService.getCurrentUser();
        if (currentUser == null) {
            return Optional.empty();
        }

        // Verificar que el hotel pertenece al usuario actual
        Optional<Hotel> hotelOpt = hotelRepository.findByIdAndUsuarioIdUsuario(hotelId, currentUser.getIdUsuario());
        if (hotelOpt.isPresent()) {
            Habitacion habitacion = new Habitacion();
            habitacion.setHotel(hotelOpt.get());
            habitacion.setNumero(habitacionDTO.getNumero());
            habitacion.setCapacidad(habitacionDTO.getCapacidad());
            habitacion.setPrecio(habitacionDTO.getPrecio());
            habitacion.setDescripcion(habitacionDTO.getDescripcion());
            
            // Establecer estado por defecto si no se proporciona
            if (habitacionDTO.getEstado() != null) {
                try {
                    habitacion.setEstado(Habitacion.EstadoHabitacion.valueOf(habitacionDTO.getEstado()));
                } catch (IllegalArgumentException e) {
                    habitacion.setEstado(Habitacion.EstadoHabitacion.disponible);
                }
            } else {
                habitacion.setEstado(Habitacion.EstadoHabitacion.disponible);
            }

            // Guardar la habitación primero
            Habitacion savedHabitacion = habitacionRepository.save(habitacion);
            
            // Procesar imágenes si se proporcionan
            if (habitacionDTO.getImagenesUrls() != null && !habitacionDTO.getImagenesUrls().isEmpty()) {
                List<ImagenHabitacion> imagenes = habitacionDTO.getImagenesUrls().stream()
                    .map(url -> {
                        ImagenHabitacion imagen = new ImagenHabitacion();
                        imagen.setHabitacion(savedHabitacion);
                        imagen.setUrlImagen(url);
                        return imagen;
                    })
                    .collect(Collectors.toList());
                
                // Guardar las imágenes
                imagenHabitacionRepository.saveAll(imagenes);
            }

            return Optional.of(habitacionMapper.habitacionToHabitacionDTO(savedHabitacion));
        }
        return Optional.empty();
    }

    // Crear una nueva habitación para un hotel del usuario actual usando CrearHabitacionDTO
    public Optional<HabitacionDTO> createHabitacionDesdeDTO(Integer hotelId, CrearHabitacionDTO crearHabitacionDTO) {
        Usuario currentUser = securityService.getCurrentUser();
        if (currentUser == null) {
            return Optional.empty();
        }

        // Verificar que el hotel pertenece al usuario actual
        Optional<Hotel> hotelOpt = hotelRepository.findByIdAndUsuarioIdUsuario(hotelId, currentUser.getIdUsuario());
        if (hotelOpt.isPresent()) {
            // Validar las URLs de las imágenes antes de crear la habitación
            if (!validarUrlsImagenes(crearHabitacionDTO)) {
                throw new RuntimeException("Una o más URLs de imágenes no son válidas");
            }
            
            Habitacion habitacion = new Habitacion();
            habitacion.setHotel(hotelOpt.get());
            habitacion.setNumero(crearHabitacionDTO.getNumero());
            habitacion.setCapacidad(crearHabitacionDTO.getCapacidad());
            habitacion.setPrecio(crearHabitacionDTO.getPrecio());
            habitacion.setDescripcion(crearHabitacionDTO.getDescripcion());
            
            // Establecer estado por defecto si no se proporciona
            if (crearHabitacionDTO.getEstado() != null) {
                try {
                    habitacion.setEstado(Habitacion.EstadoHabitacion.valueOf(crearHabitacionDTO.getEstado()));
                } catch (IllegalArgumentException e) {
                    habitacion.setEstado(Habitacion.EstadoHabitacion.disponible);
                }
            } else {
                habitacion.setEstado(Habitacion.EstadoHabitacion.disponible);
            }
            
            // Asignar categoría si se proporciona
            if (crearHabitacionDTO.getCategoriaId() != null) {
                // Verificar que la categoría pertenece al usuario actual
                Optional<CategoriaHabitacion> categoriaOpt = categoriaHabitacionRepository.findByIdAndUsuarioIdUsuario(
                    crearHabitacionDTO.getCategoriaId(), currentUser.getIdUsuario());
                if (categoriaOpt.isPresent()) {
                    habitacion.setCategoria(categoriaOpt.get());
                }
            }

            // Guardar la habitación primero
            Habitacion savedHabitacion = habitacionRepository.save(habitacion);
            
            try {
                // Procesar imágenes
                List<ImagenHabitacion> imagenes = new ArrayList<>();
                
                // Agregar imagenUrl si se proporciona
                if (crearHabitacionDTO.getImagenUrl() != null && !crearHabitacionDTO.getImagenUrl().isEmpty()) {
                    ImagenHabitacion imagen = new ImagenHabitacion();
                    imagen.setHabitacion(savedHabitacion);
                    imagen.setUrlImagen(crearHabitacionDTO.getImagenUrl());
                    imagenes.add(imagen);
                }
                
                // Agregar imágenes de la lista si se proporcionan
                if (crearHabitacionDTO.getImagenesUrls() != null && !crearHabitacionDTO.getImagenesUrls().isEmpty()) {
                    List<ImagenHabitacion> imagenesLista = crearHabitacionDTO.getImagenesUrls().stream()
                        .map(url -> {
                            ImagenHabitacion imagen = new ImagenHabitacion();
                            imagen.setHabitacion(savedHabitacion);
                            imagen.setUrlImagen(url);
                            return imagen;
                        })
                        .collect(Collectors.toList());
                    imagenes.addAll(imagenesLista);
                }
                
                // Guardar todas las imágenes si hay alguna
                if (!imagenes.isEmpty()) {
                    imagenHabitacionRepository.saveAll(imagenes);
                }
            } catch (Exception e) {
                // Si hay un error al guardar las imágenes, eliminar la habitación creada
                habitacionRepository.delete(savedHabitacion);
                throw new RuntimeException("Error al procesar las imágenes: " + e.getMessage());
            }

            return Optional.of(habitacionMapper.habitacionToHabitacionDTO(savedHabitacion));
        }
        return Optional.empty();
    }
    
    // Método para validar las URLs de las imágenes
    private boolean validarUrlsImagenes(CrearHabitacionDTO crearHabitacionDTO) {
        // Validar imagenUrl individual
        if (crearHabitacionDTO.getImagenUrl() != null && !crearHabitacionDTO.getImagenUrl().isEmpty()) {
            if (!esUrlValida(crearHabitacionDTO.getImagenUrl())) {
                return false;
            }
        }
        
        // Validar lista de imágenes
        if (crearHabitacionDTO.getImagenesUrls() != null && !crearHabitacionDTO.getImagenesUrls().isEmpty()) {
            for (String url : crearHabitacionDTO.getImagenesUrls()) {
                if (!esUrlValida(url)) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    // Método para verificar si una URL es válida
    private boolean esUrlValida(String url) {
        if (url == null || url.isEmpty()) {
            return false;
        }
        
        try {
            // Verificar que la URL tenga un formato válido
            java.net.URL urlObj = new java.net.URL(url);
            // Verificar que el protocolo sea http o https
            return "http".equals(urlObj.getProtocol()) || "https".equals(urlObj.getProtocol());
        } catch (java.net.MalformedURLException e) {
            return false;
        }
    }

    // Actualizar una habitación de un hotel del usuario actual
    public Optional<HabitacionDTO> updateHabitacion(Integer habitacionId, Integer hotelId, HabitacionDTO habitacionDTO) {
        Usuario currentUser = securityService.getCurrentUser();
        if (currentUser == null) {
            return Optional.empty();
        }

        // Verificar que el hotel pertenece al usuario actual
        Optional<Hotel> hotelOpt = hotelRepository.findByIdAndUsuarioIdUsuario(hotelId, currentUser.getIdUsuario());
        if (hotelOpt.isPresent()) {
            // Verificar que la habitación pertenece al hotel
            Optional<Habitacion> habitacionOpt = habitacionRepository.findByIdHabitacion(habitacionId);
            if (habitacionOpt.isPresent() && habitacionOpt.get().getHotel().getId().equals(hotelId)) {
                Habitacion habitacion = habitacionOpt.get();
                habitacion.setNumero(habitacionDTO.getNumero());
                habitacion.setCapacidad(habitacionDTO.getCapacidad());
                habitacion.setPrecio(habitacionDTO.getPrecio());
                habitacion.setDescripcion(habitacionDTO.getDescripcion());
                
                // Actualizar estado si se proporciona
                if (habitacionDTO.getEstado() != null) {
                    try {
                        habitacion.setEstado(Habitacion.EstadoHabitacion.valueOf(habitacionDTO.getEstado()));
                    } catch (IllegalArgumentException e) {
                        // Mantener el estado actual si el valor no es válido
                    }
                }
                
                // Actualizar categoría si se proporciona
                if (habitacionDTO.getCategoria() != null && habitacionDTO.getCategoria().getId() != null) {
                    // Verificar que la categoría pertenece al usuario actual
                    Optional<CategoriaHabitacion> categoriaOpt = categoriaHabitacionRepository.findByIdAndUsuarioIdUsuario(
                        habitacionDTO.getCategoria().getId(), currentUser.getIdUsuario());
                    if (categoriaOpt.isPresent()) {
                        habitacion.setCategoria(categoriaOpt.get());
                    }
                }
                
                Habitacion updatedHabitacion = habitacionRepository.save(habitacion);
                
                // Actualizar imágenes si se proporcionan
                if (habitacionDTO.getImagenesUrls() != null) {
                    // Eliminar imágenes existentes
                    imagenHabitacionRepository.deleteAll(updatedHabitacion.getImagenes());
                    
                    // Agregar nuevas imágenes si se proporcionan
                    if (!habitacionDTO.getImagenesUrls().isEmpty()) {
                        List<ImagenHabitacion> nuevasImagenes = habitacionDTO.getImagenesUrls().stream()
                            .map(url -> {
                                ImagenHabitacion imagen = new ImagenHabitacion();
                                imagen.setHabitacion(updatedHabitacion);
                                imagen.setUrlImagen(url);
                                return imagen;
                            })
                            .collect(Collectors.toList());
                        
                        imagenHabitacionRepository.saveAll(nuevasImagenes);
                    }
                }
                
                return Optional.of(habitacionMapper.habitacionToHabitacionDTO(updatedHabitacion));
            }
        }
        return Optional.empty();
    }

    // Eliminar una habitación de un hotel del usuario actual
    public boolean deleteHabitacion(Integer habitacionId, Integer hotelId) {
        Usuario currentUser = securityService.getCurrentUser();
        if (currentUser == null) {
            return false;
        }

        // Verificar que el hotel pertenece al usuario actual
        Optional<Hotel> hotelOpt = hotelRepository.findByIdAndUsuarioIdUsuario(hotelId, currentUser.getIdUsuario());
        if (hotelOpt.isPresent()) {
            // Verificar que la habitación pertenece al hotel
            Optional<Habitacion> habitacionOpt = habitacionRepository.findByIdHabitacion(habitacionId);
            if (habitacionOpt.isPresent() && habitacionOpt.get().getHotel().getId().equals(hotelId)) {
                // Notificar a los usuarios con reservas confirmadas
                notificarUsuariosPorReservasConfirmadas(habitacionOpt.get());
                
                habitacionRepository.delete(habitacionOpt.get());
                return true;
            }
        }
        return false;
    }
    
    // Método para notificar a los usuarios con reservas confirmadas en una habitación
    private void notificarUsuariosPorReservasConfirmadas(Habitacion habitacion) {
        // Obtener todas las reservas de la habitación
        List<Reserva> reservas = reservaRepository.findByHabitacion(habitacion);
        
        // Filtrar solo las reservas confirmadas
        List<Reserva> reservasConfirmadas = reservas.stream()
                .filter(reserva -> reserva.getEstado() == Reserva.EstadoReserva.confirmada)
                .collect(Collectors.toList());
        
        // Agrupar reservas por usuario y calcular totales
        Map<Usuario, Double> totalesPorUsuario = new HashMap<>();
        for (Reserva reserva : reservasConfirmadas) {
            Usuario usuario = reserva.getUsuario();
            Double totalActual = totalesPorUsuario.getOrDefault(usuario, 0.0);
            totalesPorUsuario.put(usuario, totalActual + reserva.getTotal());
        }
        
        // Enviar correos a cada usuario
        for (Map.Entry<Usuario, Double> entry : totalesPorUsuario.entrySet()) {
            Usuario usuario = entry.getKey();
            Double total = entry.getValue();
            
            // Enviar correo
            String mensaje = "Hola " + usuario.getNombreCompleto() + ",\n\n" +
                           "Le informamos que la habitación donde tenía una reserva confirmada ha sido eliminada por el administrador.\n" +
                           "El valor total de sus reservas confirmadas es de: $" + String.format("%.2f", total) + "\n" +
                           "Su dinero será devuelto en los próximos días.\n\n" +
                           "Atentamente,\n" +
                           "GO RESER.";
                           
            emailService.enviarCorreo(usuario.getEmail(), "Devolución por eliminación de habitación", mensaje);
        }
    }
}