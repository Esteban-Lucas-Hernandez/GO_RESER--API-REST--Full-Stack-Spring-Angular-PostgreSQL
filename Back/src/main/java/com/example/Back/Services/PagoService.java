package com.example.Back.Services;

import com.example.Back.Dto.PagoDetalladoDTO;
import com.example.Back.Mapper.PagoMapper;
import com.example.Back.Models.Pago;
import com.example.Back.Models.Reserva;
import com.example.Back.Repo.PagoRepository;
import com.example.Back.Repo.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;

@Service
public class PagoService {

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    /**
     * Confirmar el pago de una reserva
     * @param idReserva ID de la reserva a pagar
     * @return El pago creado
     */
    public PagoDetalladoDTO confirmarPago(Integer idReserva) {
        // Buscar la reserva por ID
        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        // Verificar que la reserva esté en estado pendiente
        if (!reserva.getEstado().equals(Reserva.EstadoReserva.pendiente)) {
            throw new RuntimeException("La reserva no está en estado pendiente");
        }

        // Crear un nuevo pago
        Pago pago = new Pago();
        pago.setReserva(reserva);
        // Convertir el método de pago de Reserva a Pago
        Pago.MetodoPago metodoPago = convertirMetodoPago(reserva.getMetodoPago());
        pago.setMetodo(metodoPago);
        pago.setMonto(reserva.getTotal());
        
        // Generar referencia de pago automática
        String referenciaPago = "REF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        pago.setReferenciaPago(referenciaPago);

        // Guardar el pago
        Pago pagoGuardado = pagoRepository.save(pago);

        // Actualizar el estado de la reserva a confirmada
        reserva.setEstado(Reserva.EstadoReserva.confirmada);
        reservaRepository.save(reserva);

        // Convertir a DTO detallado
        return PagoMapper.INSTANCE.pagoToPagoDetalladoDTO(pagoGuardado);
    }
    
    /**
     * Generar un PDF con la información del pago
     * @param pago Pago del cual se generará el PDF
     * @return Arreglo de bytes con el contenido del PDF
     * @throws DocumentException Si ocurre un error al generar el PDF
     */
    public byte[] generarComprobantePdf(Pago pago) throws DocumentException {
        Document document = new Document();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        
        try {
            PdfWriter writer = PdfWriter.getInstance(document, baos);
            document.open();
            
            // Fuentes
            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Font headerFont = new Font(Font.HELVETICA, 12, Font.BOLD);
            Font normalFont = new Font(Font.HELVETICA, 10, Font.NORMAL);
            
            // Agregar título
            Paragraph title = new Paragraph("COMPROBANTE DE PAGO", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);
            
            // Agregar información del hotel
            document.add(new Paragraph("Información del Hotel:", headerFont));
            document.add(new Paragraph("Nombre: " + (pago.getReserva().getHabitacion().getHotel().getNombre() != null ? 
                pago.getReserva().getHabitacion().getHotel().getNombre() : "N/A"), normalFont));
            document.add(new Paragraph("Dirección: " + (pago.getReserva().getHabitacion().getHotel().getDireccion() != null ? 
                pago.getReserva().getHabitacion().getHotel().getDireccion() : "N/A"), normalFont));
            document.add(new Paragraph(" "));
            
            // Agregar información de la habitación
            document.add(new Paragraph("Información de la Reserva:", headerFont));
            document.add(new Paragraph("Habitación: " + (pago.getReserva().getHabitacion().getNumero() != null ? 
                pago.getReserva().getHabitacion().getNumero() : "N/A"), normalFont));
            document.add(new Paragraph("Fecha de Inicio: " + (pago.getReserva().getFechaInicio() != null ? 
                pago.getReserva().getFechaInicio().toString() : "N/A"), normalFont));
            document.add(new Paragraph("Fecha de Fin: " + (pago.getReserva().getFechaFin() != null ? 
                pago.getReserva().getFechaFin().toString() : "N/A"), normalFont));
            document.add(new Paragraph(" "));
            
            // Agregar información del pago
            document.add(new Paragraph("Información del Pago:", headerFont));
            document.add(new Paragraph("Referencia de Pago: " + (pago.getReferenciaPago() != null ? 
                pago.getReferenciaPago() : "N/A"), normalFont));
            document.add(new Paragraph("Monto: $" + String.format("%.2f", pago.getMonto() != null ? 
                pago.getMonto() : 0.0), normalFont));
            document.add(new Paragraph("Fecha: " + (pago.getFechaPago() != null ? 
                pago.getFechaPago().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")) : "N/A"), normalFont));
            document.add(new Paragraph("Método de Pago: " + (pago.getMetodo() != null ? 
                pago.getMetodo().toString() : "N/A"), normalFont));
            document.add(new Paragraph(" "));
            
            // Agregar información del usuario
            document.add(new Paragraph("Información del Cliente:", headerFont));
            document.add(new Paragraph("Nombre: " + (pago.getReserva().getUsuario().getNombreCompleto() != null ? 
                pago.getReserva().getUsuario().getNombreCompleto() : "N/A"), normalFont));
            document.add(new Paragraph("Email: " + (pago.getReserva().getUsuario().getEmail() != null ? 
                pago.getReserva().getUsuario().getEmail() : "N/A"), normalFont));
            
        } finally {
            if (document.isOpen()) {
                document.close();
            }
        }
        
        return baos.toByteArray();
    }
    
    /**
     * Convierte el método de pago de Reserva a Pago
     * @param metodoPagoReserva Método de pago de la reserva
     * @return Método de pago para el pago
     */
    private Pago.MetodoPago convertirMetodoPago(Reserva.MetodoPago metodoPagoReserva) {
        switch (metodoPagoReserva) {
            case tarjeta:
                return Pago.MetodoPago.tarjeta;
            case efectivo:
                return Pago.MetodoPago.efectivo;
            case transferencia:
                return Pago.MetodoPago.transferencia;
            case nequi:
                return Pago.MetodoPago.nequi;
            case daviplata:
                return Pago.MetodoPago.daviplata;
            default:
                throw new IllegalArgumentException("Método de pago no válido: " + metodoPagoReserva);
        }
    }
}