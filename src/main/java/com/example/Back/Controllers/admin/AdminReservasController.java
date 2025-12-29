package com.example.Back.Controllers.admin;

import com.example.Back.Dto.ReservaDTO;
import com.example.Back.Services.ReservaService;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/reservas")
public class AdminReservasController {

    @Autowired
    private ReservaService reservaService;

    /**
     * Obtener todas las reservas de todos los hoteles del usuario actual
     */
    @GetMapping
    public ResponseEntity<List<ReservaDTO>> getReservasDeMisHoteles() {
        try {
            List<ReservaDTO> reservas = reservaService.getReservasDeMisHoteles();
            return ResponseEntity.ok(reservas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Obtener todas las reservas de un hotel específico del usuario actual
     */
    @GetMapping("/hotel/{idHotel}")
    public ResponseEntity<List<ReservaDTO>> getReservasPorHotel(@PathVariable Integer idHotel) {
        try {
            List<ReservaDTO> reservas = reservaService.getReservasPorHotelDeUsuario(idHotel);
            return ResponseEntity.ok(reservas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Endpoint para eliminar reservas canceladas y reservas con fecha de fin anterior a la fecha actual
     * Ruta: DELETE /admin/reservas
     */
    @DeleteMapping
    public ResponseEntity<?> eliminarReservasAntiguasYCanceladas() {
        try {
            int reservasEliminadas = reservaService.eliminarReservasAntiguasYCanceladas();
            
            // Crear un mapa de respuesta
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Se eliminaron " + reservasEliminadas + " reservas antiguas o canceladas");
            response.put("reservasEliminadas", reservasEliminadas);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Crear un mapa de error
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al eliminar reservas: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Generar y descargar PDF de una reserva específica por ID
     */
    @GetMapping(value = "/{idReserva}/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> generarPdfReserva(@PathVariable Integer idReserva) {
        try {
            // Obtener todas las reservas de mis hoteles
            List<ReservaDTO> todasLasReservas = reservaService.getReservasDeMisHoteles();
            
            // Filtrar la reserva específica por ID
            List<ReservaDTO> reservaFiltrada = todasLasReservas.stream()
                    .filter(r -> r.getIdReserva() != null && r.getIdReserva().equals(idReserva))
                    .collect(Collectors.toList());
            
            // Verificar que se encontró la reserva
            if (reservaFiltrada.isEmpty()) {
                throw new RuntimeException("Reserva no encontrada o no autorizada");
            }
            
            byte[] pdfBytes = generarPdfReservas(reservaFiltrada, "Reporte de Reserva - ID: " + idReserva);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "reporte_reserva_" + idReserva + ".pdf");
            headers.setContentLength(pdfBytes.length);
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (DocumentException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Generar PDF con la lista de reservas
     */
    private byte[] generarPdfReservas(List<ReservaDTO> reservas, String titulo) throws DocumentException {
        Document document = new Document();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        
        try {
            PdfWriter.getInstance(document, baos);
            document.open();
            
            // Fuentes
            Font titleFont = new Font(Font.HELVETICA, 16, Font.BOLD);
            Font headerFont = new Font(Font.HELVETICA, 12, Font.BOLD);
            Font normalFont = new Font(Font.HELVETICA, 10, Font.NORMAL);
            Font boldFont = new Font(Font.HELVETICA, 10, Font.BOLD);
            
            // Título
            Paragraph title = new Paragraph(titulo, titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);
            
            // Fecha de generación
            Paragraph date = new Paragraph("Generado el: " + java.time.LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")), normalFont);
            date.setAlignment(Element.ALIGN_RIGHT);
            date.setSpacingAfter(20);
            document.add(date);
            
            // Datos de las reservas
            for (int i = 0; i < reservas.size(); i++) {
                ReservaDTO reserva = reservas.get(i);
                
                // Agregar número de reserva como subtítulo
                if (reservas.size() > 1) {
                    Paragraph reservaTitle = new Paragraph("Reserva #" + (i + 1), headerFont);
                    reservaTitle.setSpacingBefore(10);
                    reservaTitle.setSpacingAfter(10);
                    document.add(reservaTitle);
                }
                
                // Agregar cada campo con su valor
                document.add(new Paragraph("ID: " + (reserva.getIdReserva() != null ? reserva.getIdReserva().toString() : "N/A"), normalFont));
                document.add(new Paragraph("Usuario: " + (reserva.getEmailUsuario() != null ? reserva.getEmailUsuario() : "N/A"), normalFont));
                document.add(new Paragraph("Habitación: " + (reserva.getNumeroHabitacion() != null ? reserva.getNumeroHabitacion() : "N/A"), normalFont));
                document.add(new Paragraph("Fecha Inicio: " + (reserva.getFechaInicio() != null ? reserva.getFechaInicio().toString() : "N/A"), normalFont));
                document.add(new Paragraph("Fecha Fin: " + (reserva.getFechaFin() != null ? reserva.getFechaFin().toString() : "N/A"), normalFont));
                document.add(new Paragraph("Total: " + (reserva.getTotal() != null ? "$" + String.format("%.2f", reserva.getTotal()) : "N/A"), normalFont));
                document.add(new Paragraph("Estado: " + (reserva.getEstado() != null ? reserva.getEstado() : "N/A"), normalFont));
                document.add(new Paragraph("Método Pago: " + (reserva.getMetodoPago() != null ? reserva.getMetodoPago() : "N/A"), normalFont));
                document.add(new Paragraph("Fecha Reserva: " + (reserva.getFechaReserva() != null ? reserva.getFechaReserva().toString() : "N/A"), normalFont));
                
                // Espacio entre reservas
                if (i < reservas.size() - 1) {
                    document.add(new Paragraph(" ")); // Línea en blanco
                }
            }
            
            // Total de registros
            Paragraph total = new Paragraph("Total de reservas: " + reservas.size(), normalFont);
            total.setSpacingBefore(20);
            document.add(total);
            
        } finally {
            if (document.isOpen()) {
                document.close();
            }
        }
        
        return baos.toByteArray();
    }
}