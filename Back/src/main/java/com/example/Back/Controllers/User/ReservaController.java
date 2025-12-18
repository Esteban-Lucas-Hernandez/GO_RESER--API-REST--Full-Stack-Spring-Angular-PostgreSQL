package com.example.Back.Controllers.User;

import com.example.Back.Models.Reserva;
import com.example.Back.Dto.CrearReservaDTO;
import com.example.Back.Dto.ReservaDTO;
import com.example.Back.Services.ReservaService;
import com.example.Back.Services.PagoService;
import com.example.Back.Models.Pago;
import com.lowagie.text.DocumentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/user/reservas")
public class ReservaController {
    private static final Logger logger = LoggerFactory.getLogger(ReservaController.class);

    @Autowired
    private ReservaService reservaService;
    
    @Autowired
    private PagoService pagoService;

    /**
     * Obtener los días reservados de una habitación
     */
    @GetMapping("/habitacion/{idHabitacion}/fechas-reservadas")
    public ResponseEntity<List<Object[]>> getFechasReservadas(@PathVariable Integer idHabitacion) {
        try {
            List<Object[]> fechasReservadas = reservaService.getFechasReservadas(idHabitacion);
            return ResponseEntity.ok(fechasReservadas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Crear una reserva para una habitación específica
     */
    @PostMapping("/habitacion/{idHabitacion}")
    public ResponseEntity<?> crearReserva(
            @PathVariable Integer idHabitacion,
            @RequestBody CrearReservaDTO reservaDTO) {
        logger.info("Iniciando creación de reserva para habitación ID: {}", idHabitacion);
        try {
            logger.info("Recibida solicitud de creación de reserva para habitación ID: {}", idHabitacion);
            ReservaDTO reserva = reservaService.crearReserva(idHabitacion, reservaDTO);
            logger.info("Reserva creada exitosamente con ID: {}", reserva.getIdReserva());
            return ResponseEntity.ok(reserva);
        } catch (Exception e) {
            logger.error("Error al crear reserva: {}", e.getMessage(), e);
            if (e.getMessage().contains("Usuario no autenticado")) {
                return ResponseEntity.status(401).body("Usuario no autenticado: " + e.getMessage());
            }
            return ResponseEntity.badRequest().body("Error al crear reserva: " + e.getMessage());
        }
    }

    /**
     * Obtener todas las reservas del usuario autenticado
     */
    @GetMapping
    public ResponseEntity<?> getReservasUsuario() {
        logger.info("Iniciando obtención de reservas del usuario autenticado");
        try {
            logger.info("Recibida solicitud de obtención de reservas del usuario autenticado");
            List<ReservaDTO> reservas = reservaService.getReservasPorUsuario();
            logger.info("Se encontraron {} reservas para el usuario", reservas.size());
            return ResponseEntity.ok(reservas);
        } catch (Exception e) {
            logger.error("Error al obtener reservas del usuario: {}", e.getMessage(), e);
            if (e.getMessage().contains("Usuario no autenticado")) {
                return ResponseEntity.status(401).body("Usuario no autenticado: " + e.getMessage());
            }
            return ResponseEntity.badRequest().body("Error al obtener reservas: " + e.getMessage());
        }
    }

    /**
     * Obtener todas las reservas de una habitación específica
     */
    @GetMapping("/habitacion/{idHabitacion}")
    public ResponseEntity<?> getReservasHabitacion(@PathVariable Integer idHabitacion) {
        logger.info("Iniciando obtención de reservas para habitación ID: {}", idHabitacion);
        try {
            logger.info("Recibida solicitud de obtención de reservas para habitación ID: {}", idHabitacion);
            List<ReservaDTO> reservas = reservaService.getReservasPorHabitacion(idHabitacion);
            logger.info("Se encontraron {} reservas para la habitación", reservas.size());
            return ResponseEntity.ok(reservas);
        } catch (Exception e) {
            logger.error("Error al obtener reservas de la habitación: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("Error al obtener reservas de la habitación: " + e.getMessage());
        }
    }

    /**
     * Cancelar una reserva
     */
    @PutMapping("/{idReserva}/cancelar")
    public ResponseEntity<?> cancelarReserva(@PathVariable Integer idReserva) {
        logger.info("Iniciando cancelación de reserva ID: {}", idReserva);
        try {
            logger.info("Recibida solicitud de cancelación de reserva ID: {}", idReserva);
            ReservaDTO reserva = reservaService.cancelarReserva(idReserva);
            logger.info("Reserva cancelada exitosamente");
            return ResponseEntity.ok(reserva);
        } catch (Exception e) {
            logger.error("Error al cancelar reserva: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("Error al cancelar reserva: " + e.getMessage());
        }
    }
    
    /**
     * Descargar comprobante PDF de una reserva confirmada
     * GET /user/reservas/{idReserva}/comprobante
     */
    @GetMapping("/{idReserva}/comprobante")
    public ResponseEntity<?> descargarComprobantePdf(@PathVariable Integer idReserva) {
        logger.info("Iniciando descarga de comprobante PDF para reserva ID: {}", idReserva);
        try {
            logger.info("Recibida solicitud de descarga de comprobante PDF para reserva ID: {}", idReserva);
            
            // Obtener la reserva
            Reserva reserva = reservaService.getReservaPorId(idReserva);
            
            // Verificar que la reserva esté confirmada
            if (!reserva.getEstado().equals(Reserva.EstadoReserva.confirmada)) {
                logger.warn("La reserva ID: {} no está confirmada", idReserva);
                return ResponseEntity.badRequest().body("La reserva no está confirmada");
            }
            
            // Verificar que la reserva tenga pagos
            if (reserva.getPagos() == null || reserva.getPagos().isEmpty()) {
                logger.warn("La reserva ID: {} no tiene pagos registrados", idReserva);
                return ResponseEntity.badRequest().body("La reserva no tiene pagos registrados");
            }
            
            // Obtener el primer pago (asumimos que es el pago principal)
            Pago pago = reserva.getPagos().get(0);
            
            // Generar el PDF
            byte[] pdfBytes = pagoService.generarComprobantePdf(pago);
            
            // Verificar que el PDF se generó correctamente
            if (pdfBytes == null || pdfBytes.length == 0) {
                logger.error("Error al generar PDF para reserva ID: {}", idReserva);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al generar el comprobante PDF");
            }
            
            // Configurar headers para la descarga del PDF
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "comprobante_reserva_" + idReserva + ".pdf");
            headers.setContentLength(pdfBytes.length);
            
            logger.info("Comprobante PDF generado exitosamente para reserva ID: {}", idReserva);
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (DocumentException e) {
            logger.error("Error al generar PDF para reserva ID: {}: {}", idReserva, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al generar el comprobante PDF: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error al obtener comprobante para reserva ID: {}: {}", idReserva, e.getMessage(), e);
            return ResponseEntity.badRequest().body("Error al obtener comprobante: " + e.getMessage());
        }
    }
}