package com.example.Back.Dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public class HabitacionDTO {
    private Integer idHabitacion;
    private Integer idHotel;
    private CategoriaHabitacionDTO categoria;
    private String numero;
    private Integer capacidad;
    private Double precio;
    private String descripcion;
    private String estado;
    private String imagenUrl;
    private List<String> imagenesUrls; // Lista de URLs de imágenes
    
    // Información del hotel
    private String hotelNombre;
    private Integer estrellas; // Campo agregado para las estrellas del hotel
    
    // Información de la ciudad del hotel
    private String ciudadNombre;
    private BigDecimal latitud;
    private BigDecimal longitud;
    
    // Información del departamento
    private String departamentoNombre; // Campo agregado para el nombre del departamento
    
    // Campos adicionales del hotel solicitados
    private String email;
    private String descripcionHotel;
    private LocalTime checkIn;
    private LocalTime checkOut;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Imagen del hotel
    private String hotelImagenUrl;
    
    // Política de cancelación del hotel
    private String politicaCancelacion;
    
    // Constructor por defecto
    public HabitacionDTO() {}
    
    // Constructor con parámetros
    public HabitacionDTO(Integer idHabitacion, Integer idHotel, CategoriaHabitacionDTO categoria, String numero,
                      Integer capacidad, Double precio, String descripcion, String estado, String imagenUrl,
                      List<String> imagenesUrls, String hotelNombre, Integer estrellas, String ciudadNombre,
                      BigDecimal latitud, BigDecimal longitud, String departamentoNombre, String email,
                      String descripcionHotel, LocalTime checkIn, LocalTime checkOut, LocalDateTime createdAt,
                      LocalDateTime updatedAt, String hotelImagenUrl, String politicaCancelacion) {
        this.idHabitacion = idHabitacion;
        this.idHotel = idHotel;
        this.categoria = categoria;
        this.numero = numero;
        this.capacidad = capacidad;
        this.precio = precio;
        this.descripcion = descripcion;
        this.estado = estado;
        this.imagenUrl = imagenUrl;
        this.imagenesUrls = imagenesUrls;
        this.hotelNombre = hotelNombre;
        this.estrellas = estrellas;
        this.ciudadNombre = ciudadNombre;
        this.latitud = latitud;
        this.longitud = longitud;
        this.departamentoNombre = departamentoNombre;
        this.email = email;
        this.descripcionHotel = descripcionHotel;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.hotelImagenUrl = hotelImagenUrl;
        this.politicaCancelacion = politicaCancelacion;
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
    
    public String getImagenUrl() {
        return imagenUrl;
    }
    
    public List<String> getImagenesUrls() {
        return imagenesUrls;
    }
    
    public String getHotelNombre() {
        return hotelNombre;
    }
    
    public Integer getEstrellas() {
        return estrellas;
    }
    
    public String getCiudadNombre() {
        return ciudadNombre;
    }
    
    public BigDecimal getLatitud() {
        return latitud;
    }
    
    public BigDecimal getLongitud() {
        return longitud;
    }
    
    public String getDepartamentoNombre() {
        return departamentoNombre;
    }
    
    public String getEmail() {
        return email;
    }
    
    public String getDescripcionHotel() {
        return descripcionHotel;
    }
    
    public LocalTime getCheckIn() {
        return checkIn;
    }
    
    public LocalTime getCheckOut() {
        return checkOut;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public String getHotelImagenUrl() {
        return hotelImagenUrl;
    }
    
    public String getPoliticaCancelacion() {
        return politicaCancelacion;
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
    
    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }
    
    public void setImagenesUrls(List<String> imagenesUrls) {
        this.imagenesUrls = imagenesUrls;
    }
    
    public void setHotelNombre(String hotelNombre) {
        this.hotelNombre = hotelNombre;
    }
    
    public void setEstrellas(Integer estrellas) {
        this.estrellas = estrellas;
    }
    
    public void setCiudadNombre(String ciudadNombre) {
        this.ciudadNombre = ciudadNombre;
    }
    
    public void setLatitud(BigDecimal latitud) {
        this.latitud = latitud;
    }
    
    public void setLongitud(BigDecimal longitud) {
        this.longitud = longitud;
    }
    
    public void setDepartamentoNombre(String departamentoNombre) {
        this.departamentoNombre = departamentoNombre;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public void setDescripcionHotel(String descripcionHotel) {
        this.descripcionHotel = descripcionHotel;
    }
    
    public void setCheckIn(LocalTime checkIn) {
        this.checkIn = checkIn;
    }
    
    public void setCheckOut(LocalTime checkOut) {
        this.checkOut = checkOut;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public void setHotelImagenUrl(String hotelImagenUrl) {
        this.hotelImagenUrl = hotelImagenUrl;
    }
    
    public void setPoliticaCancelacion(String politicaCancelacion) {
        this.politicaCancelacion = politicaCancelacion;
    }
    
    // Método toString
    @Override
    public String toString() {
        return "HabitacionDTO{idHabitacion=" + idHabitacion + ", idHotel=" + idHotel +
                ", categoria=" + categoria + ", numero='" + numero + '\'' +
                ", capacidad=" + capacidad + ", precio=" + precio +
                ", descripcion='" + descripcion + '\'' + ", estado='" + estado + '\'' +
                ", imagenUrl='" + imagenUrl + '\'' + ", imagenesUrls=" + imagenesUrls +
                ", hotelNombre='" + hotelNombre + '\'' + ", estrellas=" + estrellas +
                ", ciudadNombre='" + ciudadNombre + '\'' + ", latitud=" + latitud +
                ", longitud=" + longitud + ", departamentoNombre='" + departamentoNombre + '\'' +
                ", email='" + email + '\'' + ", descripcionHotel='" + descripcionHotel + '\'' +
                ", checkIn=" + checkIn + ", checkOut=" + checkOut +
                ", createdAt=" + createdAt + ", updatedAt=" + updatedAt +
                ", hotelImagenUrl='" + hotelImagenUrl + '\'' + ", politicaCancelacion='" + politicaCancelacion + '\'' + '}';
    }
}