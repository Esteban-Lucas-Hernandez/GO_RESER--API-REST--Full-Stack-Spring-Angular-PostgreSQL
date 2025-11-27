package com.example.Back.Repo;

import com.example.Back.Models.Resena;
import com.example.Back.Models.Usuario;
import com.example.Back.Models.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ResenaRepository extends JpaRepository<Resena, Integer> {
    
    List<Resena> findByHotelId(Integer hotelId);
    
    @Query("SELECT r FROM Resena r WHERE r.usuario.idUsuario = :idUsuario")
    List<Resena> findByUsuarioIdUsuario(@Param("idUsuario") Integer idUsuario);
    
    Optional<Resena> findByUsuarioAndHotel(Usuario usuario, Hotel hotel);
    
    @Query("SELECT COUNT(r) > 0 FROM Reserva r WHERE r.usuario = :usuario AND r.habitacion.hotel = :hotel AND r.estado = 'confirmada'")
    boolean hasConfirmedReservation(@Param("usuario") Usuario usuario, @Param("hotel") Hotel hotel);
}