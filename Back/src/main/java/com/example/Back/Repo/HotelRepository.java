package com.example.Back.Repo;

import com.example.Back.Models.Hotel;
import com.example.Back.Models.Usuario;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface HotelRepository extends JpaRepository<Hotel, Integer> {
    List<Hotel> findByUsuario(Usuario usuario);
    
    @EntityGraph(attributePaths = {"ciudad", "ciudad.departamento", "usuario"})
    List<Hotel> findByUsuarioIdUsuario(Integer usuarioId);
    
    @EntityGraph(attributePaths = {"ciudad", "ciudad.departamento", "usuario"})
    Optional<Hotel> findByIdAndUsuarioIdUsuario(Integer id, Integer usuarioId);
    
    @Query("SELECT CASE WHEN COUNT(h) > 0 THEN true ELSE false END FROM Hotel h WHERE h.id = :id AND h.usuario.idUsuario = :usuarioId")
    boolean existsByIdAndUsuarioIdUsuario(@Param("id") Integer id, @Param("usuarioId") Integer usuarioId);
}