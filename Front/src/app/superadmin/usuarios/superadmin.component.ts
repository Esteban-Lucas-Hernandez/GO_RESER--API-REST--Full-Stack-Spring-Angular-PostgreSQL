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
  changingStatus = false;
  deletingUser = false;

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

  // Método para cambiar el estado de un usuario
  changeUserStatus(usuario: Usuario) {
    if (!usuario.idUsuario) {
      alert('ID de usuario inválido');
      return;
    }

    this.changingStatus = true;
    const newStatus = !usuario.estado; // Cambiar al estado opuesto
    
    this.superAdminService.changeUserStatus(usuario.idUsuario, newStatus).subscribe({
      next: (response) => {
        // Actualizar la lista de usuarios
        this.getUsers();
        this.changingStatus = false;
        alert(`Estado del usuario ${usuario.nombreCompleto} actualizado correctamente`);
      },
      error: (error) => {
        console.error('Error al cambiar el estado:', error);
        alert('Error al cambiar el estado del usuario: ' + (error.error?.message || error.message));
        this.changingStatus = false;
      },
    });
  }

  // Método para eliminar un usuario
  deleteUser(usuario: Usuario) {
    if (!usuario.idUsuario) {
      alert('ID de usuario inválido');
      return;
    }

    // Confirmar antes de eliminar
    const confirmDelete = confirm(`¿Está seguro que desea eliminar al usuario ${usuario.nombreCompleto}? Puede contener hoteles y habitaciones esta acción no se puede deshacer.`);
    if (!confirmDelete) {
      return;
    }

    this.deletingUser = true;
    this.superAdminService.deleteUser(usuario.idUsuario).subscribe({
      next: (response) => {
        // Actualizar la lista de usuarios
        this.getUsers();
        this.deletingUser = false;
        alert(`Usuario ${usuario.nombreCompleto} eliminado correctamente`);
      },
      error: (error) => {
        console.error('Error al eliminar usuario:', error);
        alert('Error al eliminar el usuario: ' + (error.error?.message || error.message));
        this.deletingUser = false;
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
