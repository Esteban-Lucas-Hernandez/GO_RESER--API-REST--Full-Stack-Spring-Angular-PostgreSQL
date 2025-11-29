import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HotelService, Hotel } from '../../public/hotel.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
})
export class HeroComponent implements OnInit, OnDestroy {
  @ViewChild('searchContainer', { static: false }) searchContainer!: ElementRef;
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;

  // Texto animado para el título
  titleWordsArray: string[] = ['Bienvenido', 'a', 'GO', 'RESER'];

  // Texto animado para el subtítulo
  subtitleWordsArray: string[] = [
    'Descubre',
    'los',
    'mejores',
    'hoteles',
    'y',
    'habitaciones',
    'para',
    'tu',
    'próxima',
    'experiencia',
  ];

  // Palabras destacadas (opcional)
  highlightWords: string[] = [];

  // Palabras con enlaces (opcional)
  linkWords: string[] = [];

  // Control de animación
  animationClass = 'animate';

  // Temporizador
  private animationTimeout: any;
  private restartTimeout: any;
  private hideDropdownTimeout: any;

  // Search functionality
  searchTerm: string = '';
  allHoteles: Hotel[] = [];
  filteredHoteles: Hotel[] = [];
  showDropdown: boolean = false;

  // Dropdown positioning
  dropdownPositionTop: number = 0;
  dropdownPositionLeft: number = 0;
  dropdownWidth: number = 0;

  @Output() hotelesFilterChange = new EventEmitter<Hotel[]>();

  constructor(private hotelService: HotelService, private router: Router) {}

  ngOnInit() {
    this.startAnimation();
    this.loadHoteles();

    // Listen for window resize events to reposition dropdown
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.onWindowResize.bind(this));
    }
  }

  ngOnDestroy() {
    // Limpiar temporizadores
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
    }
    if (this.hideDropdownTimeout) {
      clearTimeout(this.hideDropdownTimeout);
    }

    // Remove event listener
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onWindowResize.bind(this));
    }
  }

  startAnimation() {
    // Reiniciar la animación
    this.animationClass = '';

    // Iniciar animación después de un pequeño retraso
    this.animationTimeout = setTimeout(() => {
      this.animationClass = 'animate';

      // Reiniciar animación después de completarla
      this.restartTimeout = setTimeout(() => {
        this.startAnimation();
      }, (this.titleWordsArray.length + this.subtitleWordsArray.length) * 100 + 2000);
    }, 100);
  }

  getWordClass(word: string): string {
    let classes = 'word ' + this.animationClass;

    if (this.highlightWords.includes(word)) {
      classes += ' highlight';
    }

    if (this.linkWords.includes(word)) {
      classes += ' link';
    }

    return classes;
  }

  onWordClick(word: string) {
    console.log('Palabra clickeada:', word);
  }

  // Load all hotels for filtering
  loadHoteles(): void {
    this.hotelService.getHoteles().subscribe({
      next: (data) => {
        this.allHoteles = data;
        this.filteredHoteles = data;
        this.hotelesFilterChange.emit(this.filteredHoteles);
      },
      error: (err) => {
        console.error('Error al cargar hoteles:', err);
      },
    });
  }

  // Filter hotels based on search term (name, city, or department)
  onSearchChange(): void {
    if (!this.searchTerm.trim()) {
      this.filteredHoteles = this.allHoteles;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredHoteles = this.allHoteles.filter((hotel) => this.matchesSearchTerm(hotel, term));
    }

    // Show dropdown only if there are results
    this.showDropdown = this.filteredHoteles.length > 0 && this.searchTerm.trim() !== '';

    // Position dropdown
    if (this.showDropdown) {
      setTimeout(() => {
        this.positionDropdown();
      }, 0);
    }

    this.hotelesFilterChange.emit(this.filteredHoteles);
  }

  // Check if a hotel matches the search term
  matchesSearchTerm(hotel: Hotel, term: string): boolean {
    // Check hotel name
    if (hotel.nombre.toLowerCase().includes(term)) {
      return true;
    }

    // Check city name
    if (hotel.ciudad && hotel.ciudad.nombre.toLowerCase().includes(term)) {
      return true;
    }

    // Check department name
    if (
      hotel.ciudad &&
      hotel.ciudad.departamento &&
      hotel.ciudad.departamento.nombre.toLowerCase().includes(term)
    ) {
      return true;
    }

    return false;
  }

  // Position the dropdown based on the search input
  positionDropdown(): void {
    if (this.searchInput && this.searchInput.nativeElement) {
      const inputRect = this.searchInput.nativeElement.getBoundingClientRect();
      this.dropdownPositionTop = inputRect.bottom + window.scrollY;
      this.dropdownPositionLeft = inputRect.left + window.scrollX;
      this.dropdownWidth = inputRect.width;
    }
  }

  // Handle window resize
  onWindowResize(): void {
    if (this.showDropdown) {
      this.positionDropdown();
    }
  }

  // Hide dropdown with delay to allow clicking on items
  hideDropdownWithDelay(): void {
    this.hideDropdownTimeout = setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  // Select a hotel from the dropdown
  selectHotel(hotel: Hotel): void {
    // Navigate to hotel details or rooms page
    this.router.navigate(['/habitaciones', hotel.id]);

    // Hide dropdown
    this.showDropdown = false;
    this.searchTerm = ''; // Clear search term
  }

  // Get city name for hotel
  getCiudadNombre(hotel: Hotel): string {
    return hotel.ciudad?.nombre || 'No especificado';
  }

  // Get department name for hotel
  getDepartamentoNombre(hotel: Hotel): string {
    return hotel.ciudad?.departamento?.nombre || 'No especificado';
  }
}
