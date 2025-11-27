package com.example.Back.Models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
}