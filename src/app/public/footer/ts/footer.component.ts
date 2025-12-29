import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: '../html/footer.component.html',
  styleUrls: ['../css/footer.component.css'],
})
export class FooterComponent {
  // Información de contacto
  contactInfo = {
    address: 'Carrera 12 # 34-56, Bogotá, Colombia',
    phone: '+57 300 455 4430',
    email: 'info@goreser.com',
  };

  // Enlaces rápidos
  quickLinks = [
    { name: 'Inicio', path: '/public' },
    { name: 'Hoteles', path: '/public#hoteles' },
    { name: '¿Por que elegirnos?', path: '/public#por-que-elegirnos' },
    { name: 'Contacto', path: '/public#contacto' },
  ];

  // Enlaces a redes sociales
  socialLinks = [
    { name: 'Facebook', url: '#', icon: 'facebook' },
    { name: 'Twitter', url: '#', icon: 'twitter' },
    { name: 'Instagram', url: 'https://www.instagram.com/estebannn.david/', icon: 'instagram' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/esteban-david-lucas-hern%C3%A1ndez-6ab481375/', icon: 'linkedin' },
  ];

  // Información de la empresa
  companyInfo = [
    { name: 'Sobre Nosotros', path: '/about' },
    { name: 'Términos y Condiciones', path: '/terms' },
    { name: 'Política de Privacidad', path: '/privacy' },
    { name: 'FAQ', path: '/faq' },
  ];

  currentYear = new Date().getFullYear();
}