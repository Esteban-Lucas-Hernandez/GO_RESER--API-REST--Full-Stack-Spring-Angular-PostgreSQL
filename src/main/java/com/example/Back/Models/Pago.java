package com.example.Back.Models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagos")
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pago")
    private Integer idPago;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_reserva", nullable = false)
    private Reserva reserva;

    @Column(name = "referencia_pago", length = 100)
    private String referenciaPago;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MetodoPago metodo;

    @Column(name = "fecha_pago", updatable = false)
    private LocalDateTime fechaPago;

    @Column(nullable = false)
    private Double monto;

    @PrePersist
    protected void onCreate() {
        fechaPago = LocalDateTime.now();
    }

    public enum MetodoPago {
        tarjeta,
        efectivo,
        transferencia,
        nequi,
        daviplata
    }
    
    // Constructor por defecto
    public Pago() {}
    
    // Constructor con parámetros
    public Pago(Integer idPago, Reserva reserva, String referenciaPago, MetodoPago metodo, LocalDateTime fechaPago, Double monto) {
        this.idPago = idPago;
        this.reserva = reserva;
        this.referenciaPago = referenciaPago;
        this.metodo = metodo;
        this.fechaPago = fechaPago;
        this.monto = monto;
    }
    
    // Getters
    public Integer getIdPago() {
        return idPago;
    }
    
    public Reserva getReserva() {
        return reserva;
    }
    
    public String getReferenciaPago() {
        return referenciaPago;
    }
    
    public MetodoPago getMetodo() {
        return metodo;
    }
    
    public LocalDateTime getFechaPago() {
        return fechaPago;
    }
    
    public Double getMonto() {
        return monto;
    }
    
    // Setters
    public void setIdPago(Integer idPago) {
        this.idPago = idPago;
    }
    
    public void setReserva(Reserva reserva) {
        this.reserva = reserva;
    }
    
    public void setReferenciaPago(String referenciaPago) {
        this.referenciaPago = referenciaPago;
    }
    
    public void setMetodo(MetodoPago metodo) {
        this.metodo = metodo;
    }
    
    public void setFechaPago(LocalDateTime fechaPago) {
        this.fechaPago = fechaPago;
    }
    
    public void setMonto(Double monto) {
        this.monto = monto;
    }
    
    // Métodos equals y hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Pago)) return false;
        Pago pago = (Pago) o;
        return idPago != null && idPago.equals(pago.idPago);
    }
    
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
    
    // Método toString
    @Override
    public String toString() {
        return "Pago{idPago=" + idPago + ", reserva=" + reserva +
                ", referenciaPago='" + referenciaPago + '\'' + ", metodo=" + metodo +
                ", fechaPago=" + fechaPago + ", monto=" + monto + '}';
    }
}