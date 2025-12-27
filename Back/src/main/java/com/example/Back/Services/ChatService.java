package com.example.Back.Services;

import com.example.Back.Models.ChatIntent;
import com.example.Back.Models.Habitacion;
import com.example.Back.Models.Hotel;
import com.example.Back.Repo.ChatIntentRepository;
import com.example.Back.Repo.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class ChatService {
    
    @Autowired
    private ChatIntentRepository chatIntentRepository;
    
    @Autowired
    private RoomService roomService;
    
    @Autowired
    private HotelRepository hotelRepository;
    
    public String processMessage(String message) {
        // Normalize the message (remove accents, question marks, lowercase)
        String normalizedMessage = normalize(message);
        
        // Find matching intents
        List<ChatIntent> intents = chatIntentRepository.findAll();
        
        for (ChatIntent intent : intents) {
            if (matches(normalizedMessage, intent.getKeywords())) {
                // Execute action based on action_type
                return executeAction(intent.getActionType(), intent.getResponse());
            }
        }
        
        // Default response if no intent matches
        return "Lo siento, no entendí tu mensaje. ¿Puedes reformularlo o preguntarme sobre habitaciones, precios o reservas?";
    }
    
    private String normalize(String text) {
        return Normalizer.normalize(text.toLowerCase(), Normalizer.Form.NFD)
            .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "")
            .replaceAll("[^a-z0-9 ]", "");
    }
    
    private boolean matches(String message, String keywords) {
        String[] keywordArray = keywords.split(",");
        for (String keyword : keywordArray) {
            String normalizedKeyword = normalize(keyword.trim());
            if (!normalizedKeyword.isEmpty()) {
                // Split both the message and keyword into words
                String[] messageWords = message.trim().split("\\s+");
                String[] keywordWords = normalizedKeyword.split("\\s+");
                
                // Method 1: Check if all keyword words exist in the message (order-independent)
                boolean allWordsFound = true;
                for (String keywordWord : keywordWords) {
                    if (!keywordWord.isEmpty()) {
                        boolean wordFound = false;
                        for (String messageWord : messageWords) {
                            if (messageWord.contains(keywordWord) || keywordWord.contains(messageWord)) {
                                wordFound = true;
                                break;
                            }
                        }
                        if (!wordFound) {
                            allWordsFound = false;
                            break;
                        }
                    }
                }
                
                if (allWordsFound) {
                    return true;
                }
                
                // Method 2: Check if any keyword word exists in the message (more flexible)
                for (String keywordWord : keywordWords) {
                    if (!keywordWord.isEmpty()) {
                        for (String messageWord : messageWords) {
                            if (messageWord.contains(keywordWord) || keywordWord.contains(messageWord)) {
                                return true; // If any keyword word matches, return true
                            }
                        }
                    }
                }
                
                // Fallback: check if the full normalized keyword is in the message
                if (message.contains(normalizedKeyword)) {
                    return true;
                }
            }
        }
        return false;
    }
    
    private String executeAction(String actionType, String response) {
        switch (actionType) {
            case "TEXT":
                return response;
            case "GET_CHEAPEST_ROOM":
                Habitacion cheapestRoom = roomService.getCheapestRoom();
                if (cheapestRoom != null) {
                    return "La habitación más económica disponible es la número " + cheapestRoom.getNumero() + 
                           " con un precio de $" + cheapestRoom.getPrecio() + " COP por noche.";
                } else {
                    return "Actualmente no hay habitaciones disponibles.";
                }
            case "GET_ALL_HOTELS":
                long hotelCount = hotelRepository.count();
                return "Actualmente contamos con " + hotelCount + " hoteles disponibles en nuestro sistema. Puedes verlos todos en la sección de hoteles de nuestra página web.";
            case "GET_HOTELS_BY_LOCATION":
                // This would require more complex logic to filter by location
                // For now, return a general response
                return "Puedes buscar hoteles por ciudad o departamento en nuestra página web. ¿En qué ciudad estás interesado? Puedo ayudarte a encontrar hoteles en Bogotá, Medellín, Cartagena y muchas otras ciudades.";
            default:
                return "Lo siento, no puedo procesar esa acción.";
        }
    }
}