package com.example.Back.Services;

import com.example.Back.Models.Reserva;
import com.example.Back.Models.Usuario;
import com.example.Back.Models.Habitacion;
import com.example.Back.Models.Hotel;
import com.example.Back.Models.Reserva.MetodoPago;
import com.example.Back.Repo.ReservaRepository;
import com.example.Back.Repo.HabitacionRepository;
import com.example.Back.Repo.UsuarioRepository;
import com.example.Back.Repo.HotelRepository;
import com.example.Back.Dto.CrearReservaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.Back.Mapper.ReservaMapper;
import com.example.Back.Dto.ReservaDTO;

@Service
public class ReservaService {
    private static final Logger logger = LoggerFactory.getLogger(ReservaService.class);

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private HabitacionRepository habitacionRepository;

    // Se elimina la inyección no utilizada de UsuarioRepository

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private SecurityService securityService;

    /**
     * Crear una reserva verificando:
     * 1. Que el usuario esté registrado
     * 2. Que la habitación exista
     * 3. Que las fechas estén en horarios permitidos (7am-7pm o 7pm-7am)
     * 4. Que no haya solapamiento de fechas
     */
    public ReservaDTO crearReserva(Integer idHabitacion, CrearReservaDTO reservaDTO) {
        logger.info("Iniciando creación de reserva para habitación ID: {}", idHabitacion);
        try {
            logger.info("Fechas de reserva: inicio={}, fin={}", reservaDTO.getFechaInicio(), reservaDTO.getFechaFin());
            logger.info("Método de pago: {}", reservaDTO.getMetodoPago());
            
            // Obtener el usuario autenticado
            Usuario usuario = securityService.getAuthenticatedUser();
            logger.info("Usuario autenticado: {}", usuario != null ? usuario.getEmail() : "null");
            
            // Verificar que el usuario esté registrado
            if (usuario == null) {
                logger.error("Usuario no autenticado");
                throw new RuntimeException("Usuario no autenticado");
            }

            // Verificar que la habitación exista
            Habitacion habitacion = habitacionRepository.findById(idHabitacion)
                    .orElseThrow(() -> {
                        logger.error("Habitación no encontrada con ID: {}", idHabitacion);
                        return new RuntimeException("Habitación no encontrada");
                    });
            logger.info("Habitación encontrada: ID={}, Precio={}", habitacion.getIdHabitacion(), habitacion.getPrecio());

            // Validar rango de fechas (LocalDate)
            if (reservaDTO.getFechaInicio().isBefore(LocalDate.now())) {
                logger.error("Fecha de entrada anterior a hoy");
                throw new RuntimeException("La fecha de entrada no puede ser anterior a hoy");
            }
            if (!reservaDTO.getFechaInicio().isBefore(reservaDTO.getFechaFin())) {
                logger.error("Rango de fechas inválido: inicio no es antes que fin");
                throw new RuntimeException("La fecha de salida debe ser posterior a la fecha de entrada");
            }

            // Verificar que no haya solapamiento de reservas
            boolean solapadas = reservaRepository.existsSolapadas(
                habitacion, 
                reservaDTO.getFechaInicio(), 
                reservaDTO.getFechaFin()
            );
            if (solapadas) {
                logger.error("Ya existen reservas en ese rango de fechas para esta habitación");
                throw new RuntimeException("Ya existen reservas en ese rango de fechas para esta habitación");
            }

            // Calcular total basado en noches
            long noches = java.time.temporal.ChronoUnit.DAYS.between(
                reservaDTO.getFechaInicio(), 
                reservaDTO.getFechaFin()
            );
            logger.info("Noches calculadas: {}", noches);
            if (noches < 1) {
                logger.error("Rango de fechas no válido para calcular noches");
                throw new RuntimeException("La reserva debe ser al menos de 1 noche");
            }
            double total = habitacion.getPrecio() * noches;
            logger.info("Cálculo: noches={}, total={}", noches, total);

            // Crear la reserva
            Reserva reserva = new Reserva();
            reserva.setUsuario(usuario);
            reserva.setHabitacion(habitacion);
            reserva.setFechaInicio(reservaDTO.getFechaInicio());
            reserva.setFechaFin(reservaDTO.getFechaFin());
            reserva.setTotal(total);
            reserva.setMetodoPago(getMetodoPago(reservaDTO.getMetodoPago()));
            
            logger.info("Guardando reserva en base de datos");
            Reserva reservaGuardada = reservaRepository.save(reserva);
            logger.info("Reserva guardada con ID: {}", reservaGuardada.getIdReserva());
            
            // Convertir a DTO
            return ReservaMapper.INSTANCE.reservaToReservaDTO(reservaGuardada);
        } catch (Exception e) {
            logger.error("Error al crear reserva: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Convertir string a enum de método de pago
     */
    private MetodoPago getMetodoPago(String metodo) {
        if (metodo == null || metodo.isEmpty()) {
            return MetodoPago.tarjeta; // Valor por defecto
        }

        try {
            // Verificar que el método de pago sea uno de los valores válidos
            for (MetodoPago pago : MetodoPago.values()) {
                if (pago.name().equalsIgnoreCase(metodo)) {
                    return pago;
                }
            }
            throw new IllegalArgumentException("Método de pago no válido: " + metodo);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Método de pago no válido: " + metodo);
        }
    }

    /**
     * Obtener todas las reservas del usuario autenticado
     */
    public List<ReservaDTO> getReservasPorUsuario() {
        logger.info("Iniciando obtención de reservas del usuario autenticado");
        try {
            Usuario usuario = securityService.getAuthenticatedUser();
            if (usuario == null) {
                logger.error("Usuario no autenticado al obtener reservas");
                throw new RuntimeException("Usuario no autenticado");
            }
            logger.info("Usuario autenticado para obtener reservas: {}", usuario.getEmail());
            List<Reserva> reservas = reservaRepository.findByUsuario(usuario);
            logger.info("Se encontraron {} reservas para el usuario {}", reservas.size(), usuario.getEmail());
            
            // Convertir a DTOs
            return reservas.stream()
                    .map(ReservaMapper.INSTANCE::reservaToReservaDTO)
                    .collect(java.util.stream.Collectors.toList());
        } catch (Exception e) {
            logger.error("Error al obtener reservas por usuario: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Obtener todas las reservas de una habitación
     */
    public List<ReservaDTO> getReservasPorHabitacion(Integer idHabitacion) {
        logger.info("Iniciando obtención de reservas por habitación ID: {}", idHabitacion);
        try {
            logger.info("Obteniendo reservas por habitación ID: {}", idHabitacion);
            Habitacion habitacion = habitacionRepository.findById(idHabitacion)
                    .orElseThrow(() -> {
                        logger.error("Habitación no encontrada al obtener reservas: {}", idHabitacion);
                        return new RuntimeException("Habitación no encontrada");
                    });
            List<Reserva> reservas = reservaRepository.findByHabitacion(habitacion);
            logger.info("Se encontraron {} reservas para la habitación {}", reservas.size(), idHabitacion);
            
            // Convertir a DTOs
            return reservas.stream()
                    .map(ReservaMapper.INSTANCE::reservaToReservaDTO)
                    .collect(java.util.stream.Collectors.toList());
        } catch (Exception e) {
            logger.error("Error al obtener reservas por habitación: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Obtener todas las reservas de todos los hoteles del usuario actual
     */
    public List<ReservaDTO> getReservasDeMisHoteles() {
        logger.info("Iniciando obtención de reservas de todos los hoteles del usuario actual");
        try {
            // Obtener el usuario autenticado
            Usuario usuario = securityService.getAuthenticatedUser();
            if (usuario == null) {
                logger.error("Usuario no autenticado al obtener reservas de mis hoteles");
                throw new RuntimeException("Usuario no autenticado");
            }
            
            // Obtener todos los hoteles del usuario
            List<Hotel> hoteles = hotelRepository.findByUsuario(usuario);
            
            // Obtener todas las reservas de todas las habitaciones de todos los hoteles del usuario
            List<Reserva> todasLasReservas = hoteles.stream()
                .flatMap(hotel -> habitacionRepository.findByHotel(hotel).stream())
                .flatMap(habitacion -> reservaRepository.findByHabitacion(habitacion).stream())
                .collect(Collectors.toList());
            
            logger.info("Se encontraron {} reservas en total de mis hoteles", todasLasReservas.size());
            
            // Convertir a DTOs
            return todasLasReservas.stream()
                    .map(ReservaMapper.INSTANCE::reservaToReservaDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error al obtener reservas de mis hoteles: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Obtener todas las reservas de un hotel específico que pertenece al usuario actual
     */
    public List<ReservaDTO> getReservasPorHotelDeUsuario(Integer idHotel) {
        logger.info("Iniciando obtención de reservas por hotel ID: {} del usuario actual", idHotel);
        try {
            // Obtener el usuario autenticado
            Usuario usuario = securityService.getAuthenticatedUser();
            if (usuario == null) {
                logger.error("Usuario no autenticado al obtener reservas por hotel");
                throw new RuntimeException("Usuario no autenticado");
            }
            
            // Verificar que el hotel pertenece al usuario actual
            Optional<Hotel> hotelOpt = hotelRepository.findByIdAndUsuarioIdUsuario(idHotel, usuario.getIdUsuario());
            if (!hotelOpt.isPresent()) {
                logger.error("Hotel no encontrado o no pertenece al usuario actual: {}", idHotel);
                throw new RuntimeException("Hotel no encontrado o no pertenece al usuario actual");
            }
            
            Hotel hotel = hotelOpt.get();
            
            // Obtener todas las habitaciones del hotel
            List<Habitacion> habitaciones = habitacionRepository.findByHotel(hotel);
            
            // Obtener todas las reservas de todas las habitaciones del hotel
            List<Reserva> reservas = habitaciones.stream()
                .flatMap(habitacion -> reservaRepository.findByHabitacion(habitacion).stream())
                .collect(Collectors.toList());
            
            logger.info("Se encontraron {} reservas para el hotel {}", reservas.size(), idHotel);
            
            // Convertir a DTOs
            return reservas.stream()
                    .map(ReservaMapper.INSTANCE::reservaToReservaDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error al obtener reservas por hotel de usuario: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Cancelar una reserva
     */
    public ReservaDTO cancelarReserva(Integer idReserva) {
        logger.info("Iniciando cancelación de reserva ID: {}", idReserva);
        try {
            logger.info("Cancelando reserva ID: {}", idReserva);
            Usuario usuario = securityService.getAuthenticatedUser();
            if (usuario == null) {
                logger.error("Usuario no autenticado al cancelar reserva");
                throw new RuntimeException("Usuario no autenticado");
            }

            Reserva reserva = reservaRepository.findById(idReserva)
                    .orElseThrow(() -> {
                        logger.error("Reserva no encontrada al cancelar: {}", idReserva);
                        return new RuntimeException("Reserva no encontrada");
                    });

            // Verificar que la reserva pertenezca al usuario
            if (!reserva.getUsuario().getIdUsuario().equals(usuario.getIdUsuario())) {
                logger.error("Usuario no autorizado para cancelar reserva. Usuario ID: {}, Reserva ID: {}", 
                            usuario.getIdUsuario(), idReserva);
                throw new RuntimeException("No tienes permiso para cancelar esta reserva");
            }

            reserva.setEstado(Reserva.EstadoReserva.cancelada);
            Reserva reservaCancelada = reservaRepository.save(reserva);
            logger.info("Reserva cancelada exitosamente: {}", idReserva);
            // Convertir a DTO
            return ReservaMapper.INSTANCE.reservaToReservaDTO(reservaCancelada);
        } catch (Exception e) {
            logger.error("Error al cancelar reserva: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    /**
     * Obtener una reserva por su ID
     */
    public Reserva getReservaPorId(Integer idReserva) {
        logger.info("Obteniendo reserva por ID: {}", idReserva);
        try {
            Reserva reserva = reservaRepository.findById(idReserva)
                    .orElseThrow(() -> {
                        logger.error("Reserva no encontrada: {}", idReserva);
                        return new RuntimeException("Reserva no encontrada");
                    });
            logger.info("Reserva encontrada: ID={}, Estado={}", reserva.getIdReserva(), reserva.getEstado());
            return reserva;
        } catch (Exception e) {
            logger.error("Error al obtener reserva por ID: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    /**
     * Obtener los días reservados de una habitación
     */
    public List<Object[]> getFechasReservadas(Integer idHabitacion) {
        logger.info("Obteniendo fechas reservadas para la habitación ID: {}", idHabitacion);
        try {
            // Verificar que la habitación exista
            Habitacion habitacion = habitacionRepository.findById(idHabitacion)
                    .orElseThrow(() -> {
                        logger.error("Habitación no encontrada: {}", idHabitacion);
                        return new RuntimeException("Habitación no encontrada");
                    });
            
            // Obtener las fechas reservadas
            List<Object[]> fechasReservadas = reservaRepository.findFechasReservadasConfirmadas(habitacion);
            logger.info("Se encontraron {} rangos de fechas reservadas para la habitación {}", fechasReservadas.size(), idHabitacion);
            return fechasReservadas;
        } catch (Exception e) {
            logger.error("Error al obtener fechas reservadas: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    /**
     * Obtener los días reservados confirmados de una habitación
     */
    public List<Object[]> getFechasReservadasConfirmadas(Integer idHabitacion) {
        logger.info("Obteniendo fechas reservadas confirmadas para la habitación ID: {}", idHabitacion);
        try {
            // Verificar que la habitación exista
            Habitacion habitacion = habitacionRepository.findById(idHabitacion)
                    .orElseThrow(() -> {
                        logger.error("Habitación no encontrada: {}", idHabitacion);
                        return new RuntimeException("Habitación no encontrada");
                    });
            
            // Obtener las fechas reservadas confirmadas
            List<Object[]> fechasReservadas = reservaRepository.findFechasReservadasConfirmadas(habitacion);
            logger.info("Se encontraron {} rangos de fechas reservadas confirmadas para la habitación {}", fechasReservadas.size(), idHabitacion);
            return fechasReservadas;
        } catch (Exception e) {
            logger.error("Error al obtener fechas reservadas confirmadas: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    /**
     * Confirmar una reserva (cambiar de pendiente a confirmada)
     */
    public ReservaDTO confirmarReserva(Integer idReserva) {
        logger.info("Iniciando confirmación de reserva ID: {}", idReserva);
        try {
            logger.info("Confirmando reserva ID: {}", idReserva);
            Usuario usuario = securityService.getAuthenticatedUser();
            if (usuario == null) {
                logger.error("Usuario no autenticado al confirmar reserva");
                throw new RuntimeException("Usuario no autenticado");
            }

            Reserva reserva = reservaRepository.findById(idReserva)
                    .orElseThrow(() -> {
                        logger.error("Reserva no encontrada al confirmar: {}", idReserva);
                        return new RuntimeException("Reserva no encontrada");
                    });

            // Verificar que la reserva pertenezca al usuario
            if (!reserva.getUsuario().getIdUsuario().equals(usuario.getIdUsuario())) {
                logger.error("Usuario no autorizado para confirmar reserva. Usuario ID: {}, Reserva ID: {}", 
                            usuario.getIdUsuario(), idReserva);
                throw new RuntimeException("No tienes permiso para confirmar esta reserva");
            }

            // Verificar que la reserva esté en estado pendiente
            if (!reserva.getEstado().equals(Reserva.EstadoReserva.pendiente)) {
                logger.error("La reserva no está en estado pendiente. Estado actual: {}", reserva.getEstado());
                throw new RuntimeException("La reserva no está en estado pendiente");
            }

            reserva.setEstado(Reserva.EstadoReserva.confirmada);
            Reserva reservaConfirmada = reservaRepository.save(reserva);
            logger.info("Reserva confirmada exitosamente: {}", idReserva);
            // Convertir a DTO
            return ReservaMapper.INSTANCE.reservaToReservaDTO(reservaConfirmada);
        } catch (Exception e) {
            logger.error("Error al confirmar reserva: {}", e.getMessage(), e);
            throw e;
        }
    }
    public int eliminarReservasAntiguasYCanceladas() {
        logger.info("Iniciando eliminación de reservas antiguas y canceladas");
        try {
            // Obtener el usuario autenticado
            Usuario usuario = securityService.getAuthenticatedUser();
            if (usuario == null) {
                logger.error("Usuario no autenticado al eliminar reservas antiguas y canceladas");
                throw new RuntimeException("Usuario no autenticado");
            }
            
            // Obtener todos los hoteles del usuario
            List<Hotel> hoteles = hotelRepository.findByUsuario(usuario);
            
            // Contador de reservas eliminadas
            int reservasEliminadas = 0;
            
            // Para cada hotel del usuario
            for (Hotel hotel : hoteles) {
                // Obtener todas las habitaciones del hotel
                List<Habitacion> habitaciones = habitacionRepository.findByHotel(hotel);
                
                // Para cada habitación del hotel
                for (Habitacion habitacion : habitaciones) {
                    // Obtener todas las reservas de la habitación
                    List<Reserva> reservas = reservaRepository.findByHabitacion(habitacion);
                    
                    // Filtrar y eliminar reservas canceladas o con fecha de fin anterior a hoy
                    for (Reserva reserva : reservas) {
                        // Verificar si la reserva está cancelada
                        boolean esCancelada = reserva.getEstado() == Reserva.EstadoReserva.cancelada;
                        
                        // Verificar si la fecha de fin es anterior a la fecha actual
                        boolean fechaPasada = reserva.getFechaFin().isBefore(LocalDate.now());
                        
                        // Si cumple cualquiera de las condiciones, eliminarla
                        if (esCancelada || fechaPasada) {
                            reservaRepository.delete(reserva);
                            reservasEliminadas++;
                            logger.info("Reserva eliminada: ID={}, Estado={}, FechaFin={}", 
                                reserva.getIdReserva(), reserva.getEstado(), reserva.getFechaFin());
                        }
                    }
                }
            }
            
            logger.info("Se eliminaron {} reservas antiguas o canceladas", reservasEliminadas);
            return reservasEliminadas;
        } catch (Exception e) {
            logger.error("Error al eliminar reservas antiguas y canceladas: {}", e.getMessage(), e);
            throw e;
        }
    }
}