import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-informacion-extra',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './informacion-extra.component.html',
  styleUrls: ['./informacion-extra.component.css'],
})
export class InformacionExtraComponent {
  // Información de servicios destacados
  servicios = [
    {
      icon: '🏨',
      titulo: 'Amplia Selección de Hoteles',
      descripcion:
        'Encuentra los mejores hoteles en las ubicaciones más deseadas con las comodidades que necesitas.',
    },
    {
      icon: '💰',
      titulo: 'Precios Competitivos',
      descripcion:
        'Ofrecemos las mejores tarifas garantizadas con descuentos exclusivos para nuestros clientes.',
    },
    {
      icon: '🔒',
      titulo: 'Reservas Seguras',
      descripcion:
        'Tu seguridad es nuestra prioridad. Reservas protegidas con encriptación de última generación.',
    },
    {
      icon: '⭐',
      titulo: 'Experiencias Únicas',
      descripcion:
        'Vive experiencias inolvidables con nuestras recomendaciones personalizadas y servicios premium.',
    },
  ];

  // Información estadística
  estadisticas = [
    { valor: '500+', etiqueta: 'Hoteles Asociados' },
    { valor: '10K+', etiqueta: 'Clientes Satisfechos' },
    { valor: '24/7', etiqueta: 'Soporte Disponible' },
    { valor: '99%', etiqueta: 'Recomendación' },
  ];
}
