import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelesCarruselComponent } from '../../hoteles-carrusel/ts/hoteles-carrusel.component';
import { NavComponent } from '../../nav/ts/nav.component';
import { HeroComponent } from '../../hero/ts/hero.component';
import { InformacionExtraComponent } from '../../informacion-extra/ts/informacion-extra.component';
import { FooterComponent } from '../../footer/ts/footer.component';
import { FeaturesSectionComponent } from '../../features-section/ts/features-section.component';
import { HotelService } from '../../hotel.service';

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
    FeaturesSectionComponent,
  ],
  providers: [HotelService],
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.css'],
})
export class PublicComponent {
  constructor() {}
}
