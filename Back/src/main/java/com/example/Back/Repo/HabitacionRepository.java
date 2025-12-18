package com.example.Back.Repo;

import com.example.Back.Models.Habitacion;
import com.example.Back.Models.Hotel;
import com.example.Back.Models.CategoriaHabitacion;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface HabitacionRepository extends JpaRepository<Habitacion, Integer> {
    List<Habitacion> findByHotel(Hotel hotel);
    
    @EntityGraph(attributePaths = {"imagenes", "hotel.ciudad"})
    List<Habitacion> findByHotelAndEstado(Hotel hotel, com.example.Back.Models.Habitacion.EstadoHabitacion estado);
    
    @EntityGraph(attributePaths = {"imagenes", "hotel.ciudad"})
    Optional<Habitacion> findByIdHabitacion(Integer idHabitacion);
    
    @Query("SELECT h FROM Habitacion h WHERE h.idHabitacion = :idHabitacion AND h.hotel.id = :hotelId")
    Optional<Habitacion> findByIdHabitacionAndHotelId(@Param("idHabitacion") Integer idHabitacion, @Param("hotelId") Integer hotelId);
    
    @Query("SELECT CASE WHEN COUNT(h) > 0 THEN true ELSE false END FROM Habitacion h WHERE h.idHabitacion = :idHabitacion AND h.hotel.id = :hotelId")
    boolean existsByIdHabitacionAndHotelId(@Param("idHabitacion") Integer idHabitacion, @Param("hotelId") Integer hotelId);
    
    // Método para verificar si existen habitaciones asociadas a una categoría
    @Query("SELECT COUNT(h) FROM Habitacion h WHERE h.categoria.id = :categoriaId")
    long countByCategoriaId(@Param("categoriaId") Integer categoriaId);
}