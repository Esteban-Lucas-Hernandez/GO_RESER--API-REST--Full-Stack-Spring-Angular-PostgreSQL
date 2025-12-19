package com.example.Back.Models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "imagenes_habitacion")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImagenHabitacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_imagen")
    private Integer idImagen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_habitacion", nullable = false)
    private Habitacion habitacion;

    @Column(name = "url_imagen", nullable = false, length = 255)
    private String urlImagen;
    
    // Getter explícito como fallback
    public String getUrlImagen() {
        return urlImagen;
    }
    
    // Setter explícito como fallback
    public void setUrlImagen(String urlImagen) {
        this.urlImagen = urlImagen;
    }
}
