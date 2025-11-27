package com.example.Back.Controllers.Public;

import com.example.Back.Dto.HabitacionDTO;
import com.example.Back.Dto.HabitacionDetalleDTO;
import com.example.Back.Dto.HotelPublicDTO;
import com.example.Back.Mapper.HabitacionMapper;
import com.example.Back.Mapper.HabitacionDetalleMapper;
import com.example.Back.Mapper.HotelPublicMapper;
import com.example.Back.Models.Habitacion;
import com.example.Back.Models.Hotel;
import com.example.Back.Repo.HabitacionRepository;
import com.example.Back.Repo.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/public")
public class HotelPublicController {

    @Autowired
    private HotelRepository hotelRepository;
    
    @Autowired
    private HabitacionRepository habitacionRepository;
    
    @Autowired
    private HabitacionMapper habitacionMapper;
    
    @Autowired
    private HabitacionDetalleMapper habitacionDetalleMapper;
    
    @Autowired
    private HotelPublicMapper hotelPublicMapper;

    @GetMapping("/hoteles")
    public ResponseEntity<List<HotelPublicDTO>> getAllHoteles() {
        try {
            List<Hotel> hoteles = hotelRepository.findAll();
            List<HotelPublicDTO> hotelDTOs = hotelPublicMapper.hotelsToHotelPublicDTOs(hoteles);
            return ResponseEntity.ok(hotelDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    
    @GetMapping("/hoteles/{idHotel}/habitaciones")
    public ResponseEntity<List<HabitacionDTO>> getHabitacionesByHotel(@PathVariable Integer idHotel) {
        try {
            // Verificar si el hotel existe
            Hotel hotel = hotelRepository.findById(idHotel).orElse(null);
            if (hotel == null) {
                return ResponseEntity.notFound().build();
            }
            
            List<Habitacion> habitaciones = habitacionRepository.findByHotelAndEstado(hotel, Habitacion.EstadoHabitacion.disponible);
            List<HabitacionDTO> habitacionDTOs = habitacionMapper.habitacionesToHabitacionDTOs(habitaciones);
            return ResponseEntity.ok(habitacionDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    
    @GetMapping("/hoteles/{idHotel}/habitaciones/{idHabitacion}")
    public ResponseEntity<HabitacionDetalleDTO> getHabitacionById(@PathVariable Integer idHotel, @PathVariable Integer idHabitacion) {
        try {
            // Verificar si el hotel existe
            Hotel hotel = hotelRepository.findById(idHotel).orElse(null);
            if (hotel == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Verificar si la habitación existe y pertenece al hotel
            Habitacion habitacion = habitacionRepository.findByIdHabitacion(idHabitacion).orElse(null);
            if (habitacion == null || !habitacion.getHotel().getId().equals(idHotel)) {
                return ResponseEntity.notFound().build();
            }
            
            HabitacionDetalleDTO habitacionDetalleDTO = habitacionDetalleMapper.habitacionToHabitacionDetalleDTO(habitacion);
            return ResponseEntity.ok(habitacionDetalleDTO);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}