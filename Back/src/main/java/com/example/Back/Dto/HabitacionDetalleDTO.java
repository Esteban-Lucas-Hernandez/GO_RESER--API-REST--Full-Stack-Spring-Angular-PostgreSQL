package com.example.Back.Dto;

import java.util.List;
import java.time.LocalTime;

public class HabitacionDetalleDTO {
    private Integer idHabitacion;
    private Integer idHotel;
    private CategoriaHabitacionDTO categoria;
    private String numero;
    private Integer capacidad;
    private Double precio;
    private String descripcion;
    private String estado;
    private List<String> imagenesUrls;
    
    // Campos adicionales del hotel
    private String hotelNombre;
    private String ciudadNombre;
    private String departamentoNombre;
    private LocalTime checkIn;
    private LocalTime checkOut;
    
    // Constructor por defecto
    public HabitacionDetalleDTO() {}
    
    // Constructor con parámetros
    public HabitacionDetalleDTO(Integer idHabitacion, Integer idHotel, CategoriaHabitacionDTO categoria, String numero,
                           Integer capacidad, Double precio, String descripcion, String estado,
                           List<String> imagenesUrls, String hotelNombre, String ciudadNombre,
                           String departamentoNombre, LocalTime checkIn, LocalTime checkOut) {
        this.idHabitacion = idHabitacion;
        this.idHotel = idHotel;
        this.categoria = categoria;
        this.numero = numero;
        this.capacidad = capacidad;
        this.precio = precio;
        this.descripcion = descripcion;
        this.estado = estado;
        this.imagenesUrls = imagenesUrls;
        this.hotelNombre = hotelNombre;
        this.ciudadNombre = ciudadNombre;
        this.departamentoNombre = departamentoNombre;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
    }
    
    // Getters
    public Integer getIdHabitacion() {
        return idHabitacion;
    }
    
    public Integer getIdHotel() {
        return idHotel;
    }
    
    public CategoriaHabitacionDTO getCategoria() {
        return categoria;
    }
    
    public String getNumero() {
        return numero;
    }
    
    public Integer getCapacidad() {
        return capacidad;
    }
    
    public Double getPrecio() {
        return precio;
    }
    
    public String getDescripcion() {
        return descripcion;
    }
    
    public String getEstado() {
        return estado;
    }
    
    public List<String> getImagenesUrls() {
        return imagenesUrls;
    }
    
    public String getHotelNombre() {
        return hotelNombre;
    }
    
    public String getCiudadNombre() {
        return ciudadNombre;
    }
    
    public String getDepartamentoNombre() {
        return departamentoNombre;
    }
    
    public LocalTime getCheckIn() {
        return checkIn;
    }
    
    public LocalTime getCheckOut() {
        return checkOut;
    }
    
    // Setters
    public void setIdHabitacion(Integer idHabitacion) {
        this.idHabitacion = idHabitacion;
    }
    
    public void setIdHotel(Integer idHotel) {
        this.idHotel = idHotel;
    }
    
    public void setCategoria(CategoriaHabitacionDTO categoria) {
        this.categoria = categoria;
    }
    
    public void setNumero(String numero) {
        this.numero = numero;
    }
    
    public void setCapacidad(Integer capacidad) {
        this.capacidad = capacidad;
    }
    
    public void setPrecio(Double precio) {
        this.precio = precio;
    }
    
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public void setEstado(String estado) {
        this.estado = estado;
    }
    
    public void setImagenesUrls(List<String> imagenesUrls) {
        this.imagenesUrls = imagenesUrls;
    }
    
    public void setHotelNombre(String hotelNombre) {
        this.hotelNombre = hotelNombre;
    }
    
    public void setCiudadNombre(String ciudadNombre) {
        this.ciudadNombre = ciudadNombre;
    }
    
    public void setDepartamentoNombre(String departamentoNombre) {
        this.departamentoNombre = departamentoNombre;
    }
    
    public void setCheckIn(LocalTime checkIn) {
        this.checkIn = checkIn;
    }
    
    public void setCheckOut(LocalTime checkOut) {
        this.checkOut = checkOut;
    }
    
    // Método toString
    @Override
    public String toString() {
        return "HabitacionDetalleDTO{idHabitacion=" + idHabitacion + ", idHotel=" + idHotel +
                ", categoria=" + categoria + ", numero='" + numero + '\'' +
                ", capacidad=" + capacidad + ", precio=" + precio +
                ", descripcion='" + descripcion + '\'' + ", estado='" + estado + '\'' +
                ", imagenesUrls=" + imagenesUrls + ", hotelNombre='" + hotelNombre + '\'' +
                ", ciudadNombre='" + ciudadNombre + '\'' + ", departamentoNombre='" + departamentoNombre + '\'' +
                ", checkIn=" + checkIn + ", checkOut=" + checkOut + '}';
    }
}