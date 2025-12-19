package com.example.Back.Models;

import jakarta.persistence.*;

@Entity
@Table(name = "imagenes_habitacion")
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
    
    // Constructor por defecto
    public ImagenHabitacion() {}
    
    // Constructor con parámetros
    public ImagenHabitacion(Integer idImagen, Habitacion habitacion, String urlImagen) {
        this.idImagen = idImagen;
        this.habitacion = habitacion;
        this.urlImagen = urlImagen;
    }
    
    // Getters
    public Integer getIdImagen() {
        return idImagen;
    }
    
    public Habitacion getHabitacion() {
        return habitacion;
    }
    
    public String getUrlImagen() {
        return urlImagen;
    }
    
    // Setters
    public void setIdImagen(Integer idImagen) {
        this.idImagen = idImagen;
    }
    
    public void setHabitacion(Habitacion habitacion) {
        this.habitacion = habitacion;
    }
    
    public void setUrlImagen(String urlImagen) {
        this.urlImagen = urlImagen;
    }
    
    // Métodos equals y hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ImagenHabitacion)) return false;
        ImagenHabitacion that = (ImagenHabitacion) o;
        return idImagen != null && idImagen.equals(that.idImagen);
    }
    
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
    
    // Método toString
    @Override
    public String toString() {
        return "ImagenHabitacion{idImagen=" + idImagen + ", habitacion=" + habitacion + ", urlImagen='" + urlImagen + '\'' + '}';
    }
}
