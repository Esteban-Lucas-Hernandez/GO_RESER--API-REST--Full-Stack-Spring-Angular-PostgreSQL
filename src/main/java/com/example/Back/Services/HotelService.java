package com.example.Back.Services;

import com.example.Back.Models.Hotel;
import com.example.Back.Repo.HotelRepository;
import com.example.Back.Dto.HotelDTO;
import com.example.Back.Models.Ciudad;
import com.example.Back.Models.Usuario;
import com.example.Back.Repo.CiudadRepository;
import com.example.Back.Repo.UsuarioRepository;
import com.example.Back.Mapper.HotelMapper;
import com.example.Back.Repo.HabitacionRepository;
import com.example.Back.Repo.ReservaRepository;
import com.example.Back.Models.Reserva;
import com.example.Back.Models.Habitacion;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Stream;

@Service
public class HotelService {

    private final HotelRepository hotelRepository;
    private final CiudadRepository ciudadRepository;
    private final UsuarioRepository usuarioRepository;
    private final HotelMapper hotelMapper;
    private final SecurityService securityService;
    private final HabitacionRepository habitacionRepository;
    private final ReservaRepository reservaRepository;
    private final EmailService emailService;

    @Autowired
    public HotelService(HotelRepository hotelRepository, CiudadRepository ciudadRepository, 
                       UsuarioRepository usuarioRepository, HotelMapper hotelMapper, 
                       SecurityService securityService, HabitacionRepository habitacionRepository,
                       ReservaRepository reservaRepository, EmailService emailService) {
        this.hotelRepository = hotelRepository;
        this.ciudadRepository = ciudadRepository;
        this.usuarioRepository = usuarioRepository;
        this.hotelMapper = hotelMapper;
        this.securityService = securityService;
        this.habitacionRepository = habitacionRepository;
        this.reservaRepository = reservaRepository;
        this.emailService = emailService;
    }

    public List<Hotel> getAllHoteles() {
        return hotelRepository.findAll();
    }
    
    // Método para obtener todos los hoteles como DTOs
    public List<HotelDTO> getAllHotelesDTO() {
        List<Hotel> hotels = hotelRepository.findAll();
        return hotels.stream()
                .map(hotelMapper::hotelToHotelDTO)
                .collect(Collectors.toList());
    }
    
    // Método para obtener hoteles del usuario actual como DTOs
    public List<HotelDTO> getHotelesByCurrentUser() {
        Usuario currentUser = securityService.getCurrentUser();
        if (currentUser != null) {
            List<Hotel> hotels = hotelRepository.findByUsuario(currentUser);
            return hotels.stream()
                    .map(hotelMapper::hotelToHotelDTO)
                    .collect(Collectors.toList());
        }
        return List.of(); // Devuelve una lista vacía si no hay usuario autenticado
    }
    
    // Método para obtener un hotel por ID
    public Optional<Hotel> getHotelById(Integer id) {
        return hotelRepository.findById(id);
    }
    
    // Método para crear un nuevo hotel
    public Hotel createHotel(HotelDTO hotelDTO) {
        Hotel hotel = hotelMapper.hotelDTOToHotel(hotelDTO);
        
        // Asociar con el usuario actual
        Usuario currentUser = securityService.getCurrentUser();
        if (currentUser != null) {
            hotel.setUsuario(currentUser);
        }
        
        // Si se proporciona una ciudad, la buscamos y asignamos
        if (hotelDTO.getCiudadId() != null) {
            Ciudad ciudad = ciudadRepository.findById(hotelDTO.getCiudadId()).orElse(null);
            hotel.setCiudad(ciudad);
        } else if (hotelDTO.getCiudadNombre() != null && !hotelDTO.getCiudadNombre().isEmpty()) {
            Ciudad ciudad = ciudadRepository.findByNombre(hotelDTO.getCiudadNombre()).orElse(null);
            hotel.setCiudad(ciudad);
        }
        
        return hotelRepository.save(hotel);
    }
    
    // Método para actualizar un hotel
    public Hotel updateHotel(Integer id, HotelDTO hotelDTO) {
        Optional<Hotel> existingHotel = hotelRepository.findById(id);
        if (existingHotel.isPresent()) {
            Hotel hotel = existingHotel.get();
            
            // Actualizar propiedades básicas usando MapStruct
            hotelMapper.updateHotelFromDTO(hotelDTO, hotel);
            
            // Si se proporciona una ciudad, la buscamos y asignamos
            if (hotelDTO.getCiudadId() != null) {
                Ciudad ciudad = ciudadRepository.findById(hotelDTO.getCiudadId()).orElse(null);
                hotel.setCiudad(ciudad);
            } else if (hotelDTO.getCiudadNombre() != null && !hotelDTO.getCiudadNombre().isEmpty()) {
                Ciudad ciudad = ciudadRepository.findByNombre(hotelDTO.getCiudadNombre()).orElse(null);
                hotel.setCiudad(ciudad);
            }
            
            return hotelRepository.save(hotel);
        }
        return null;
    }
    
    // Método para eliminar un hotel con todas sus dependencias en cascada
    public boolean deleteHotelWithCascade(Integer id) {
        Optional<Hotel> hotelOpt = hotelRepository.findById(id);
        if (hotelOpt.isPresent()) {
            Hotel hotel = hotelOpt.get();
            
            // Verificar si hay reservas confirmadas y notificar a los usuarios
            notificarUsuariosPorReservasConfirmadas(hotel);
            
            // Debido a la configuración de cascada, al eliminar el hotel se eliminarán:
            // 1. Todas las habitaciones del hotel
            // 2. Todas las reseñas del hotel
            // 3. Todas las reservas de las habitaciones del hotel
            hotelRepository.delete(hotel);
            return true;
        }
        return false;
    }
    
    // Método para verificar si un hotel tiene habitaciones asociadas
    public boolean hasHabitaciones(Integer hotelId) {
        Optional<Hotel> hotel = hotelRepository.findById(hotelId);
        if (hotel.isPresent()) {
            return !habitacionRepository.findByHotel(hotel.get()).isEmpty();
        }
        return false;
    }
    
    // Método para notificar a los usuarios con reservas confirmadas
    private void notificarUsuariosPorReservasConfirmadas(Hotel hotel) {
        // Obtener todas las habitaciones del hotel
        List<Habitacion> habitaciones = habitacionRepository.findByHotel(hotel);
        
        // Obtener todas las reservas confirmadas de esas habitaciones
        List<Reserva> reservasConfirmadas = habitaciones.stream()
                .flatMap(habitacion -> reservaRepository.findByHabitacion(habitacion).stream())
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
                           "Le informamos que el hotel donde tenía una reserva confirmada ha sido eliminado por el administrador.\n" +
                           "El valor total de sus reservas confirmadas es de: $" + String.format("%.2f", total) + "\n" +
                           "Su dinero será devuelto en los próximos días.\n\n" +
                           "Atentamente,\n" +
                           "GO RESER.";
                           
            emailService.enviarCorreo(usuario.getEmail(), "Devolución por eliminación de hotel", mensaje);
        }
    }
}