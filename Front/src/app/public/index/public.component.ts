import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelesCarruselComponent } from '../hoteles-carrusel/hoteles-carrusel.component';
import { NavComponent } from '../nav/nav.component';
import { HeroComponent } from '../hero/hero.component';
import { InformacionExtraComponent } from '../informacion-extra/informacion-extra.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-public',
  standalone: true,
  imports: [
    CommonModule,
    HotelesCarruselComponent,
    NavComponent,
    HeroComponent,
    InformacionExtraComponent,
    FooterComponent,
  ],
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.css'],
})
export class PublicComponent {
  constructor() {}
}
