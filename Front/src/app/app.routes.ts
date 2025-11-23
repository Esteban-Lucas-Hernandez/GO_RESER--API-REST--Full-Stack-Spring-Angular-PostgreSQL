import { Routes } from '@angular/router';
import { PublicComponent } from './public/index/public.component';
import { LoginComponent } from './auth/login/ts/login.component';
import { RegistroComponent } from './auth/registro/ts/registro.component';
import { AuthGuard } from './auth/auth.guard';
import { SuperAdminGuard } from './auth/superadmin.guard';
import { AdminGuard } from './auth/admin.guard';
import { PanelComponent } from './admin/panel/panel.component';
import { HotelesComponent } from './admin/hoteles/hoteles.component';
import { ListarCategoriaComponent } from './admin/categoria/listar/ts/listar-categoria.component';
import { CrearCategoriaComponent } from './admin/categoria/crear/ts/crear-categoria.component';
import { EditarCategoriaComponent } from './admin/categoria/editar/ts/editar-categoria.component';
import { ListarHabitacionComponent } from './admin/habitacion/listar/ts/listar-habitacion.component';
import { CrearHabitacionComponent } from './admin/habitacion/crear/ts/crear-habitacion.component';
import { EditarHabitacionComponent } from './admin/habitacion/editar/ts/editar-habitacion.component';
import { ListarHabitacionesComponent } from './admin/habitacion/listar-habitaciones/ts/listar-habitaciones.component';
import { AdminComponent } from './admin/admin.component';
import { SuperAdminComponent } from './superadmin/usuarios/superadmin.component';
import { SuperAdminContainerComponent } from './superadmin/superadmin.component';
import { SuperAdminPerfilComponent } from './superadmin/perfil/perfil.component';
import { SuperAdminHotelesComponent } from './superadmin/hoteles/hoteles.component';
import { HabitacionesComponent } from './public/Habitaciones/habitaciones.component';
import { DetalleHabitacionComponent } from './public/DetalleHabitacion/DetalleHabitacion.component';
import { MisReservasComponent } from './public/reservas/ts/mis-reservas.component';
import { PerfilComponent } from './admin/perfil/perfil.component';
import { PerfilComponent as PublicPerfilComponent } from './public/perfil/perfil.component';

export const routes: Routes = [
  { path: '', redirectTo: 'public', pathMatch: 'full' },
  { path: 'public', component: PublicComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'habitaciones/:id', component: HabitacionesComponent },
  { path: 'detalle-habitacion/:hotelId/:id', component: DetalleHabitacionComponent },
  { path: 'mis-reservas', component: MisReservasComponent, canActivate: [AuthGuard] },
  { path: 'perfil', component: PublicPerfilComponent, canActivate: [AuthGuard] },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      { path: 'panel', component: PanelComponent },
      { path: 'dashboard', redirectTo: 'panel', pathMatch: 'full' },
      { path: 'hoteles', component: HotelesComponent },
      { path: 'categoria/listar', component: ListarCategoriaComponent },
      { path: 'categoria/crear', component: CrearCategoriaComponent },
      { path: 'categoria/editar/:id', component: EditarCategoriaComponent },
      { path: 'habitacion/listar/:hotelId', component: ListarHabitacionComponent },
      { path: 'habitacion/crear/:hotelId', component: CrearHabitacionComponent },
      { path: 'habitacion/editar/:hotelId/:id', component: EditarHabitacionComponent },
      {
        path: 'habitacion/imagenes/:hotelId/:habitacionId',
        component: ListarHabitacionesComponent,
      },
      { path: 'perfil', component: PerfilComponent },
      { path: '', redirectTo: 'panel', pathMatch: 'full' },
    ],
  },
  {
    path: 'superadmin',
    component: SuperAdminContainerComponent,
    canActivate: [SuperAdminGuard],
    children: [
      { path: 'usuarios', component: SuperAdminComponent },
      { path: 'hoteles', component: SuperAdminHotelesComponent },
      { path: 'perfil', component: SuperAdminPerfilComponent },
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'public' },
];
