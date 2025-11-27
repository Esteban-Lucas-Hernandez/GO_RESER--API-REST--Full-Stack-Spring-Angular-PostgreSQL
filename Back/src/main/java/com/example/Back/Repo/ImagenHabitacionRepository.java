package com.example.Back.Repo;

import com.example.Back.Models.ImagenHabitacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImagenHabitacionRepository extends JpaRepository<ImagenHabitacion, Integer> {
    List<ImagenHabitacion> findByHabitacionIdHabitacion(Integer habitacionId);
    
    @Query("SELECT i FROM ImagenHabitacion i WHERE i.idImagen = :id AND i.habitacion.idHabitacion = :habitacionId AND i.habitacion.hotel.id = :hotelId")
    Optional<ImagenHabitacion> findByIdAndHabitacionIdAndHotelId(@Param("id") Integer id, @Param("habitacionId") Integer habitacionId, @Param("hotelId") Integer hotelId);
    
    @Query("SELECT i FROM ImagenHabitacion i WHERE i.habitacion.idHabitacion = :habitacionId AND i.habitacion.hotel.id = :hotelId")
    List<ImagenHabitacion> findByHabitacionIdAndHotelId(@Param("habitacionId") Integer habitacionId, @Param("hotelId") Integer hotelId);
}