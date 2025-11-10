import { Routes } from '@angular/router';
import { PublicComponent } from './public/public.component';
import { LoginComponent } from './auth/login/login.component';
import { RegistroComponent } from './auth/registro/registro.component';

export const routes: Routes = [
  { path: '', redirectTo: 'public', pathMatch: 'full' }, // Redirige la ruta raíz a public (sin barra inicial)
  { path: 'public', component: PublicComponent }, // Ruta principal pública
  { path: 'login', component: LoginComponent }, // Ruta de login
  { path: 'registro', component: RegistroComponent }, // Ruta de registro
  { path: '**', redirectTo: 'public' }, // Redirige rutas no encontradas a public (sin barra inicial)
];
