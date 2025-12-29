package com.example.Back.Repo;

import com.example.Back.Models.Habitacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Habitacion, Integer> {
    
    @Query("SELECT h FROM Habitacion h WHERE h.estado = com.example.Back.Models.Habitacion.EstadoHabitacion.disponible ORDER BY h.precio ASC")
    List<Habitacion> findCheapestRooms();
    
    List<Habitacion> findTop1ByEstadoOrderByPrecioAsc(com.example.Back.Models.Habitacion.EstadoHabitacion estado);
}