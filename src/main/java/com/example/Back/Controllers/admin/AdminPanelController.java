package com.example.Back.Controllers.admin;

import java.util.HashMap; 
import java.util.Map; 

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/admin")
public class AdminPanelController {

   @GetMapping("/dashboard")
    public Map<String, Object> adminDashboard() {
    Map<String, Object> response = new HashMap<>();
    response.put("mensaje", "Vista de administrador");
    return response;
}
}