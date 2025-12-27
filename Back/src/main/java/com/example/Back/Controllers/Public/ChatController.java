package com.example.Back.Controllers.Public;

import com.example.Back.Services.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/public/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("response", "Por favor, envíe un mensaje válido."));
        }
        
        String response = chatService.processMessage(message);
        
        return ResponseEntity.ok(Map.of("response", response));
    }
}