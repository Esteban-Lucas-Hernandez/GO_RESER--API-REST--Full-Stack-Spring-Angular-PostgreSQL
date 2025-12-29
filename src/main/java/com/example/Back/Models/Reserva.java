package com.example.Back.Models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "reservas")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reserva")
    private Integer idReserva;

    // Relación con el usuario (cliente o admin)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    // Relación con la habitación
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_habitacion", nullable = false)
    private Habitacion habitacion;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDate fechaFin;

    @Column(nullable = false)
    private Double total;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoReserva estado = EstadoReserva.pendiente;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pago", nullable = false)
    private MetodoPago metodoPago = MetodoPago.tarjeta;

    @Column(name = "fecha_reserva", updatable = false)
    private LocalDateTime fechaReserva;

    // Relación con pagos con eliminación en cascada
    @OneToMany(mappedBy = "reserva", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Pago> pagos;

    @PrePersist
    protected void onCreate() {
        fechaReserva = LocalDateTime.now();
    }

    // ENUMS
    public enum EstadoReserva {
        pendiente,
        confirmada,
        cancelada
    }

    public enum MetodoPago {
        tarjeta,
        efectivo,
        transferencia,
        nequi,
        daviplata
    }
    
    // Constructor por defecto
    public Reserva() {}
    
    // Constructor con parámetros
    public Reserva(Integer idReserva, Usuario usuario, Habitacion habitacion, LocalDate fechaInicio, LocalDate fechaFin, Double total, EstadoReserva estado, MetodoPago metodoPago, LocalDateTime fechaReserva, List<Pago> pagos) {
        this.idReserva = idReserva;
        this.usuario = usuario;
        this.habitacion = habitacion;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.total = total;
        this.estado = estado != null ? estado : EstadoReserva.pendiente;
        this.metodoPago = metodoPago != null ? metodoPago : MetodoPago.tarjeta;
        this.fechaReserva = fechaReserva;
        this.pagos = pagos;
    }
    
    // Getters
    public Integer getIdReserva() {
        return idReserva;
    }
    
    public Usuario getUsuario() {
        return usuario;
    }
    
    public Habitacion getHabitacion() {
        return habitacion;
    }
    
    public LocalDate getFechaInicio() {
        return fechaInicio;
    }
    
    public LocalDate getFechaFin() {
        return fechaFin;
    }
    
    public Double getTotal() {
        return total;
    }
    
    public EstadoReserva getEstado() {
        return estado;
    }
    
    public MetodoPago getMetodoPago() {
        return metodoPago;
    }
    
    public LocalDateTime getFechaReserva() {
        return fechaReserva;
    }
    
    public List<Pago> getPagos() {
        return pagos;
    }
    
    // Setters
    public void setIdReserva(Integer idReserva) {
        this.idReserva = idReserva;
    }
    
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    
    public void setHabitacion(Habitacion habitacion) {
        this.habitacion = habitacion;
    }
    
    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }
    
    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }
    
    public void setTotal(Double total) {
        this.total = total;
    }
    
    public void setEstado(EstadoReserva estado) {
        this.estado = estado != null ? estado : EstadoReserva.pendiente;
    }
    
    public void setMetodoPago(MetodoPago metodoPago) {
        this.metodoPago = metodoPago != null ? metodoPago : MetodoPago.tarjeta;
    }
    
    public void setFechaReserva(LocalDateTime fechaReserva) {
        this.fechaReserva = fechaReserva;
    }
    
    public void setPagos(List<Pago> pagos) {
        this.pagos = pagos;
    }
    
    // Métodos equals y hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Reserva)) return false;
        Reserva reserva = (Reserva) o;
        return idReserva != null && idReserva.equals(reserva.idReserva);
    }
    
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
    
    // Método toString
    @Override
    public String toString() {
        return "Reserva{idReserva=" + idReserva + ", usuario=" + usuario +
                ", habitacion=" + habitacion + ", fechaInicio=" + fechaInicio +
                ", fechaFin=" + fechaFin + ", total=" + total +
                ", estado=" + estado + ", metodoPago=" + metodoPago +
                ", fechaReserva=" + fechaReserva + ", pagos=" + pagos + '}';
    }
}