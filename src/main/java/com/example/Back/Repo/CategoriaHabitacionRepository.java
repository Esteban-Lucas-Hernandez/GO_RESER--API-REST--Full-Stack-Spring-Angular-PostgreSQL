package com.example.Back.Repo;

import com.example.Back.Models.CategoriaHabitacion;
import com.example.Back.Models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaHabitacionRepository extends JpaRepository<CategoriaHabitacion, Integer> {
    @Query("SELECT c FROM CategoriaHabitacion c WHERE c.usuario.idUsuario = :usuarioId")
    List<CategoriaHabitacion> findByUsuarioIdUsuario(@Param("usuarioId") Integer usuarioId);
    
    @Query("SELECT c FROM CategoriaHabitacion c WHERE c.id = :id AND c.usuario.idUsuario = :usuarioId")
    Optional<CategoriaHabitacion> findByIdAndUsuarioIdUsuario(@Param("id") Integer id, @Param("usuarioId") Integer usuarioId);
}