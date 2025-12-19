package com.example.Back.Dto;

public class ImagenHabitacionDTO {
    private Integer idImagen;
    private Integer idHabitacion;
    private String urlImagen;
    
    // Constructor por defecto
    public ImagenHabitacionDTO() {}
    
    // Constructor con parámetros
    public ImagenHabitacionDTO(Integer idImagen, Integer idHabitacion, String urlImagen) {
        this.idImagen = idImagen;
        this.idHabitacion = idHabitacion;
        this.urlImagen = urlImagen;
    }
    
    // Getters
    public Integer getIdImagen() {
        return idImagen;
    }
    
    public Integer getIdHabitacion() {
        return idHabitacion;
    }
    
    public String getUrlImagen() {
        return urlImagen;
    }
    
    // Setters
    public void setIdImagen(Integer idImagen) {
        this.idImagen = idImagen;
    }
    
    public void setIdHabitacion(Integer idHabitacion) {
        this.idHabitacion = idHabitacion;
    }
    
    public void setUrlImagen(String urlImagen) {
        this.urlImagen = urlImagen;
    }
    
    // Método toString
    @Override
    public String toString() {
        return "ImagenHabitacionDTO{idImagen=" + idImagen + ", idHabitacion=" + idHabitacion +
                ", urlImagen='" + urlImagen + '\'' + '}';
    }
}