package com.example.Back.Controllers.User;

import com.example.Back.Dto.PagoDetalladoDTO;
import com.example.Back.Models.Pago;
import com.example.Back.Repo.PagoRepository;
import com.example.Back.Services.PagoService;
import com.lowagie.text.DocumentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

@RestController
@RequestMapping("/user/pagos")
public class PagoController {
    private static final Logger logger = LoggerFactory.getLogger(PagoController.class);

    @Autowired
    private PagoService pagoService;
    
    @Autowired
    private PagoRepository pagoRepository;

    /**
     * Confirmar el pago de una reserva y devolver comprobante PDF
     * POST /user/pagos/confirmar/{idReserva}
     */
    @PostMapping("/confirmar/{idReserva}")
    public ResponseEntity<?> confirmarPago(@PathVariable Integer idReserva) {
        logger.info("Iniciando confirmación de pago y generación de PDF para reserva ID: {}", idReserva);
        try {
            logger.info("Recibida solicitud de confirmación de pago y generación de PDF para reserva ID: {}", idReserva);
            
            // Confirmar el pago
            PagoDetalladoDTO pagoDTO = pagoService.confirmarPago(idReserva);
            
            // Obtener el pago completo con relaciones
            Optional<Pago> pagoOpt = pagoRepository.findById(pagoDTO.getIdPago());
            if (!pagoOpt.isPresent()) {
                logger.error("Error al obtener el pago generado para reserva ID: {}", idReserva);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al obtener el pago generado");
            }
            
            Pago pago = pagoOpt.get();
            
            // Generar el PDF
            byte[] pdfBytes = pagoService.generarComprobantePdf(pago);
            
            // Verificar que el PDF se generó correctamente
            if (pdfBytes == null || pdfBytes.length == 0) {
                logger.error("Error al generar PDF - bytes vacíos para reserva ID: {}", idReserva);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al generar el comprobante PDF");
            }
            
            // Configurar headers para la descarga del PDF
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "comprobante_pago_" + pagoDTO.getIdPago() + ".pdf");
            headers.setContentLength(pdfBytes.length);
            
            logger.info("Pago confirmado y PDF generado exitosamente para reserva ID: {}", idReserva);
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (DocumentException e) {
            logger.error("Error al generar PDF para reserva ID: {}: {}", idReserva, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al generar el comprobante PDF: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error al confirmar pago para reserva ID: {}: {}", idReserva, e.getMessage(), e);
            return ResponseEntity.badRequest().body("Error al confirmar pago: " + e.getMessage());
        }
    }
    
    /**
     * Confirmar el pago de una reserva y descargar comprobante PDF
     * POST /user/pagos/confirmar/{idReserva}/pdf
     */
    @PostMapping("/confirmar/{idReserva}/pdf")
    public ResponseEntity<?> confirmarPagoYGenerarPdf(@PathVariable Integer idReserva) {
        logger.info("Iniciando confirmación de pago y generación de PDF para reserva ID: {}", idReserva);
        try {
            logger.info("Recibida solicitud de confirmación de pago y generación de PDF para reserva ID: {}", idReserva);
            
            // Confirmar el pago
            PagoDetalladoDTO pagoDTO = pagoService.confirmarPago(idReserva);
            
            // Obtener el pago completo con relaciones
            Optional<Pago> pagoOpt = pagoRepository.findById(pagoDTO.getIdPago());
            if (!pagoOpt.isPresent()) {
                logger.error("Error al obtener el pago generado para reserva ID: {}", idReserva);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al obtener el pago generado");
            }
            
            Pago pago = pagoOpt.get();
            
            // Generar el PDF
            byte[] pdfBytes = pagoService.generarComprobantePdf(pago);
            
            // Verificar que el PDF se generó correctamente
            if (pdfBytes == null || pdfBytes.length == 0) {
                logger.error("Error al generar PDF - bytes vacíos para reserva ID: {}", idReserva);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al generar el comprobante PDF");
            }
            
            // Configurar headers para la descarga del PDF
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "comprobante_pago_" + pagoDTO.getIdPago() + ".pdf");
            headers.setContentLength(pdfBytes.length);
            
            logger.info("Pago confirmado y PDF generado exitosamente para reserva ID: {}", idReserva);
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (DocumentException e) {
            logger.error("Error al generar PDF para reserva ID: {}: {}", idReserva, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al generar el comprobante PDF: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error al confirmar pago para reserva ID: {}: {}", idReserva, e.getMessage(), e);
            return ResponseEntity.badRequest().body("Error al confirmar pago: " + e.getMessage());
        }
    }
}