package com.example.Back.Dto;

import lombok.Data;

@Data
public class Ciudad {
    private Integer id;
    private String nombre;
    private Double latitud;
    private Double longitud;
    private Departamento departamento;
}