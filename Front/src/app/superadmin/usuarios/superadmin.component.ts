import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SuperAdminService, Usuario } from './superadmin.service';

@Component({
  selector: 'app-superadmin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.css'],
})
export class SuperAdminComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = false;
  changingRole = false;

  // Propiedades para el diálogo de cambio de rol
  showRoleChangeDialog = false;
  selectedUser: Usuario | null = null;
  selectedRole: string | null = null;
  availableRoles = ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_SUPERADMIN'];

  constructor(private superAdminService: SuperAdminService) {}

  ngOnInit(): void {
    // Obtener la lista de usuarios
    this.getUsers();
  }

  // Método para obtener la lista de usuarios
  getUsers() {
    this.loading = true;
    this.superAdminService.getAllUsers().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
        this.loading = false;
      },
    });
  }

  // Método para abrir el diálogo de cambio de rol
  openRoleChangeDialog(usuario: Usuario) {
    this.selectedUser = usuario;
    this.selectedRole = usuario.roles && usuario.roles.length > 0 ? usuario.roles[0] : null;
    this.showRoleChangeDialog = true;
  }

  // Método para cerrar el diálogo de cambio de rol
  closeRoleChangeDialog() {
    this.showRoleChangeDialog = false;
    this.selectedUser = null;
    this.selectedRole = null;
  }

  // Método para seleccionar un rol
  selectRole(role: string) {
    this.selectedRole = role;
  }

  // Método para confirmar el cambio de rol
  confirmRoleChange() {
    if (!this.selectedUser || !this.selectedRole) {
      alert('Debe seleccionar un usuario y un rol');
      return;
    }

    this.changeUserRole(this.selectedUser.idUsuario, this.selectedRole);
    this.closeRoleChangeDialog();
  }

  // Método para cambiar el rol de un usuario
  changeUserRole(userId: number, newRole: string) {
    // Verificar que el ID sea válido
    if (!userId) {
      alert('ID de usuario inválido');
      return;
    }

    this.changingRole = true;
    this.superAdminService.changeUserRole(userId, newRole).subscribe({
      next: (response) => {
        // Actualizar la lista de usuarios
        this.getUsers();
        this.changingRole = false;
      },
      error: (error) => {
        console.error('Error al cambiar el rol:', error);
        alert('Error al cambiar el rol del usuario: ' + (error.error?.message || error.message));
        this.changingRole = false;
      },
    });
  }
}
