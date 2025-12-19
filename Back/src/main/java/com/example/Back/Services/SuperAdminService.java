package com.example.Back.Services;

import com.example.Back.Dto.HotelDTO;
import com.example.Back.Dto.HabitacionDTO;
import com.example.Back.Dto.ReservaDTO;
import com.example.Back.Dto.UsuarioDTO;
import com.example.Back.Mapper.HotelMapper;
import com.example.Back.Mapper.HabitacionMapper;
import com.example.Back.Mapper.ReservaMapper;
import com.example.Back.Mapper.UsuarioMapper;
import com.example.Back.Models.CategoriaHabitacion;
import com.example.Back.Models.Habitacion;
import com.example.Back.Models.Hotel;
import com.example.Back.Models.Resena;
import com.example.Back.Models.Reserva;
import com.example.Back.Models.Role;
import com.example.Back.Models.Usuario;
import com.example.Back.Repo.HabitacionRepository;
import com.example.Back.Repo.HotelRepository;
import com.example.Back.Repo.ResenaRepository;
import com.example.Back.Repo.ReservaRepository;
import com.example.Back.Repo.RoleRepository;
import com.example.Back.Repo.UsuarioRepository;
import com.example.Back.Repo.CategoriaHabitacionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SuperAdminService {

    private final UsuarioRepository usuarioRepository;
    private final RoleRepository roleRepository;
    private final UsuarioMapper usuarioMapper;
    private final HotelRepository hotelRepository;
    private final HabitacionRepository habitacionRepository;
    private final ReservaRepository reservaRepository;
    private final ResenaRepository resenaRepository;
    private final CategoriaHabitacionRepository categoriaHabitacionRepository;
    private final HotelMapper hotelMapper;
    private final HabitacionMapper habitacionMapper;
    
    // Constructor
    public SuperAdminService(UsuarioRepository usuarioRepository, RoleRepository roleRepository, 
                           UsuarioMapper usuarioMapper, HotelRepository hotelRepository, 
                           HabitacionRepository habitacionRepository, ReservaRepository reservaRepository, 
                           ResenaRepository resenaRepository, CategoriaHabitacionRepository categoriaHabitacionRepository, 
                           HotelMapper hotelMapper, HabitacionMapper habitacionMapper) {
        this.usuarioRepository = usuarioRepository;
        this.roleRepository = roleRepository;
        this.usuarioMapper = usuarioMapper;
        this.hotelRepository = hotelRepository;
        this.habitacionRepository = habitacionRepository;
        this.reservaRepository = reservaRepository;
        this.resenaRepository = resenaRepository;
        this.categoriaHabitacionRepository = categoriaHabitacionRepository;
        this.hotelMapper = hotelMapper;
        this.habitacionMapper = habitacionMapper;
    }

    public List<UsuarioDTO> listarUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(usuarioMapper::toDTO)
                .collect(Collectors.toList());
    }

    public Usuario obtenerUsuarioPorId(Integer idUsuario) {
        return usuarioRepository.findById(idUsuario)
              .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }


    @Transactional
    public UsuarioDTO actualizarRoles(Integer idUsuario, List<String> nombresRoles) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar que todos los roles solicitados existen
        List<Role> rolesExistentes = roleRepository.findByNombreIn(nombresRoles);
        
        // Si no se encontraron todos los roles solicitados, lanzar una excepción
        if (rolesExistentes.size() != nombresRoles.size()) {
            throw new RuntimeException("Algunos roles no existen");
        }

        Set<Role> roles = rolesExistentes.stream()
                .collect(Collectors.toSet());

        usuario.setRoles(roles);
        Usuario actualizado = usuarioRepository.save(usuario);
        return usuarioMapper.toDTO(actualizado);
    }

    @Transactional
    public UsuarioDTO cambiarEstadoUsuario(Integer idUsuario, Boolean estado) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        usuario.setEstado(estado);
        Usuario actualizado = usuarioRepository.save(usuario);
        return usuarioMapper.toDTO(actualizado);
    }

    @Transactional
    public void eliminarUsuario(Integer idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Eliminar todas las reseñas del usuario
        List<Resena> resenasUsuario = resenaRepository.findByUsuarioIdUsuario(idUsuario);
        resenaRepository.deleteAll(resenasUsuario);
        
        // Eliminar todas las reservas del usuario y sus pagos asociados
        List<Reserva> reservasUsuario = reservaRepository.findByUsuario(usuario);
        reservaRepository.deleteAll(reservasUsuario);
        
        // Eliminar todos los hoteles del usuario (con cascada elimina habitaciones, reseñas y reservas)
        List<Hotel> hotelesUsuario = hotelRepository.findByUsuario(usuario);
        hotelRepository.deleteAll(hotelesUsuario);
        
        // Eliminar todas las categorías creadas por el usuario
        List<CategoriaHabitacion> categoriasUsuario = categoriaHabitacionRepository.findByUsuarioIdUsuario(idUsuario);
        categoriaHabitacionRepository.deleteAll(categoriasUsuario);
        
        // Finalmente, eliminar al usuario
        usuarioRepository.delete(usuario);
    }

    // Métodos para hoteles
    public List<HotelDTO> listarHoteles() {
        return hotelRepository.findAll()
                .stream()
                .map(hotelMapper::hotelToHotelDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public boolean eliminarHotelConDependencias(Integer idHotel) {
        return hotelRepository.findById(idHotel)
                .map(hotel -> {
                    hotelRepository.delete(hotel);
                    return true;
                })
                .orElse(false);
    }

    // Métodos para habitaciones
    public List<HabitacionDTO> listarHabitaciones() {
        return habitacionRepository.findAll()
                .stream()
                .map(habitacionMapper::habitacionToHabitacionDTO)
                .collect(Collectors.toList());
    }

    public List<HabitacionDTO> listarHabitacionesPorHotel(Integer idHotel) {
        Hotel hotel = hotelRepository.findById(idHotel)
                .orElseThrow(() -> new RuntimeException("Hotel no encontrado"));
        
        return habitacionRepository.findByHotel(hotel)
                .stream()
                .map(habitacionMapper::habitacionToHabitacionDTO)
                .collect(Collectors.toList());
    }

    // Métodos para reservas
    public List<ReservaDTO> listarReservas() {
        return reservaRepository.findAll()
                .stream()
                .map(ReservaMapper.INSTANCE::reservaToReservaDTO)
                .collect(Collectors.toList());
    }

    public List<ReservaDTO> listarReservasPorHotel(Integer idHotel) {
        Hotel hotel = hotelRepository.findById(idHotel)
                .orElseThrow(() -> new RuntimeException("Hotel no encontrado"));
        
        // Obtener todas las habitaciones del hotel
        List<Habitacion> habitaciones = habitacionRepository.findByHotel(hotel);
        
        // Obtener todas las reservas de esas habitaciones
        return habitaciones.stream()
                .flatMap(habitacion -> reservaRepository.findByHabitacion(habitacion).stream())
                .map(ReservaMapper.INSTANCE::reservaToReservaDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener una reserva por su ID
     */
    public ReservaDTO obtenerReservaPorId(Integer idReserva) {
        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        
        return ReservaMapper.INSTANCE.reservaToReservaDTO(reserva);
    }
}