package com.example.Back.Mapper;

import com.example.Back.Models.Hotel;
import com.example.Back.Dto.HotelPublicDTO;
import com.example.Back.Dto.Ciudad;
import com.example.Back.Dto.Departamento;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class HotelPublicMapper {

    public HotelPublicDTO hotelToHotelPublicDTO(Hotel hotel) {
        if (hotel == null) {
            return null;
        }
        
        HotelPublicDTO dto = new HotelPublicDTO();
        dto.setId(hotel.getId());
        dto.setNombre(hotel.getNombre());
        dto.setDireccion(hotel.getDireccion());
        dto.setTelefono(hotel.getTelefono());
        dto.setEmail(hotel.getEmail());
        dto.setDescripcion(hotel.getDescripcion());
        dto.setEstrellas(hotel.getEstrellas());
        dto.setPoliticaCancelacion(hotel.getPoliticaCancelacion());
        dto.setCheckIn(hotel.getCheckIn());
        dto.setCheckOut(hotel.getCheckOut());
        dto.setImagenUrl(hotel.getImagenUrl());
        dto.setCreatedAt(hotel.getCreatedAt());
        dto.setUpdatedAt(hotel.getUpdatedAt());
        
        // Mapear ciudad con información de departamento
        if (hotel.getCiudad() != null) {
            Ciudad ciudadDto = new Ciudad();
            ciudadDto.setId(hotel.getCiudad().getId());
            ciudadDto.setNombre(hotel.getCiudad().getNombre());
            
            // Asignar latitud y longitud
            if (hotel.getCiudad().getLatitud() != null) {
                ciudadDto.setLatitud(hotel.getCiudad().getLatitud().doubleValue());
            }
            if (hotel.getCiudad().getLongitud() != null) {
                ciudadDto.setLongitud(hotel.getCiudad().getLongitud().doubleValue());
            }
            
            // Agregar objeto departamento
            if (hotel.getCiudad().getDepartamento() != null) {
                Departamento depto = new Departamento();
                depto.setId(hotel.getCiudad().getDepartamento().getId());
                depto.setNombre(hotel.getCiudad().getDepartamento().getNombre());
                ciudadDto.setDepartamento(depto);
            }
            
            dto.setCiudad(ciudadDto);
            
            // También establecer latitud y longitud directamente en el DTO principal
            if (hotel.getCiudad().getLatitud() != null) {
                dto.setLatitud(hotel.getCiudad().getLatitud().doubleValue());
            }
            if (hotel.getCiudad().getLongitud() != null) {
                dto.setLongitud(hotel.getCiudad().getLongitud().doubleValue());
            }
        }
        
        return dto;
    }

    public List<HotelPublicDTO> hotelsToHotelPublicDTOs(List<Hotel> hotels) {
        return hotels.stream()
                .map(this::hotelToHotelPublicDTO)
                .collect(Collectors.toList());
    }
}