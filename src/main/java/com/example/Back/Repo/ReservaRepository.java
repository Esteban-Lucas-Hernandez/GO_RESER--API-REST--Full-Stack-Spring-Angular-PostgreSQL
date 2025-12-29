package com.example.Back.Repo;

import com.example.Back.Models.Reserva;
import com.example.Back.Models.Usuario;
import com.example.Back.Models.Habitacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Integer> {
    
    // Verificar si hay reservas solapadas confirmadas para una habitación en un rango de fechas
    @Query("SELECT COUNT(r) > 0 FROM Reserva r WHERE r.habitacion = :habitacion " +
           "AND r.estado = com.example.Back.Models.Reserva.EstadoReserva.confirmada " +
           "AND (r.fechaInicio < :fechaFin AND r.fechaFin > :fechaInicio)")
    boolean existsSolapadas(@Param("habitacion") Habitacion habitacion, 
                           @Param("fechaInicio") LocalDate fechaInicio, 
                           @Param("fechaFin") LocalDate fechaFin);
    
    // Obtener reservas de un usuario específico
    List<Reserva> findByUsuario(Usuario usuario);
    
    // Obtener reservas de una habitación específica
    List<Reserva> findByHabitacion(Habitacion habitacion);
    
    // Obtener fechas de reservas confirmadas para una habitación
    @Query("SELECT r.fechaInicio, r.fechaFin FROM Reserva r WHERE r.habitacion = :habitacion " +
           "AND r.estado = com.example.Back.Models.Reserva.EstadoReserva.confirmada")
    List<Object[]> findFechasReservadasConfirmadas(@Param("habitacion") Habitacion habitacion);
}