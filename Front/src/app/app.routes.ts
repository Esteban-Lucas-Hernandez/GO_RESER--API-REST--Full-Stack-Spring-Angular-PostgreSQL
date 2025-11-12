import { Routes } from '@angular/router';
import { PublicComponent } from './public/public.component';
import { LoginComponent } from './auth/login/ts/login.component';
import { RegistroComponent } from './auth/registro/ts/registro.component';
import { AuthGuard } from './auth/auth.guard';
import { PanelComponent } from './admin/panel/panel.component';
import { HotelesComponent } from './admin/hoteles/hoteles.component';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { ReservasComponent } from './admin/reservas/reservas.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  { path: '', redirectTo: 'public', pathMatch: 'full' },
  { path: 'public', component: PublicComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'panel', component: PanelComponent },
      { path: 'dashboard', redirectTo: 'panel', pathMatch: 'full' },
      { path: 'hoteles', component: HotelesComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'reservas', component: ReservasComponent },
      { path: '', redirectTo: 'panel', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'public' },
];
