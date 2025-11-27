package com.example.Back.Repo;

import com.example.Back.Models.Ciudad;
import com.example.Back.Models.Departamento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CiudadRepository extends JpaRepository<Ciudad, Integer> {
    Optional<Ciudad> findByNombre(String nombre);
    List<Ciudad> findByDepartamento(Departamento departamento);
}