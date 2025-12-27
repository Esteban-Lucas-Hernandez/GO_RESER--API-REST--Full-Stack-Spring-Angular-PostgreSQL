package com.example.Back.Services;

import com.example.Back.Models.Habitacion;
import com.example.Back.Repo.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {
    
    @Autowired
    private RoomRepository roomRepository;
    
    public Habitacion getCheapestRoom() {
        List<Habitacion> cheapestRooms = roomRepository.findTop1ByEstadoOrderByPrecioAsc(com.example.Back.Models.Habitacion.EstadoHabitacion.disponible);
        if (!cheapestRooms.isEmpty()) {
            return cheapestRooms.get(0);
        }
        return null;
    }
}