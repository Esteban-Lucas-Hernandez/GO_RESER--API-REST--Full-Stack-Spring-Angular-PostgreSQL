package com.example.Back.Dto;

public class ResenaDTO {
    private Integer idResena;
    private Integer idUsuario;
    private String nombreUsuario;
    private Integer idHotel;
    private String comentario;
    private Integer calificacion;
    private String fechaResena;
    private String fotoUrl;
    
    // Constructor por defecto
    public ResenaDTO() {}
    
    // Constructor con parámetros
    public ResenaDTO(Integer idResena, Integer idUsuario, String nombreUsuario, Integer idHotel, String comentario, Integer calificacion, String fechaResena, String fotoUrl) {
        this.idResena = idResena;
        this.idUsuario = idUsuario;
        this.nombreUsuario = nombreUsuario;
        this.idHotel = idHotel;
        this.comentario = comentario;
        this.calificacion = calificacion;
        this.fechaResena = fechaResena;
        this.fotoUrl = fotoUrl;
    }
    
    // Getters
    public Integer getIdResena() {
        return idResena;
    }
    
    public Integer getIdUsuario() {
        return idUsuario;
    }
    
    public String getNombreUsuario() {
        return nombreUsuario;
    }
    
    public Integer getIdHotel() {
        return idHotel;
    }
    
    public String getComentario() {
        return comentario;
    }
    
    public Integer getCalificacion() {
        return calificacion;
    }
    
    public String getFechaResena() {
        return fechaResena;
    }
    
    public String getFotoUrl() {
        return fotoUrl;
    }
    
    // Setters
    public void setIdResena(Integer idResena) {
        this.idResena = idResena;
    }
    
    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }
    
    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }
    
    public void setIdHotel(Integer idHotel) {
        this.idHotel = idHotel;
    }
    
    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
    
    public void setCalificacion(Integer calificacion) {
        this.calificacion = calificacion;
    }
    
    public void setFechaResena(String fechaResena) {
        this.fechaResena = fechaResena;
    }
    
    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }
    
    // Método toString
    @Override
    public String toString() {
        return "ResenaDTO{idResena=" + idResena + ", idUsuario=" + idUsuario +
                ", nombreUsuario='" + nombreUsuario + '\'' + ", idHotel=" + idHotel +
                ", comentario='" + comentario + '\'' + ", calificacion=" + calificacion +
                ", fechaResena='" + fechaResena + '\'' + ", fotoUrl='" + fotoUrl + '\'' + '}';
    }
}