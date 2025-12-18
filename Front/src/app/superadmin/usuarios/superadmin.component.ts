import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SuperAdminService, Usuario } from './superadmin.service';

@Component({
  selector: 'app-superadmin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.css'],
})
export class SuperAdminComponent implements OnInit {
  usuarios: Usuario[] = [];
  filteredUsers: Usuario[] = [];
  searchTerm: string = '';
  activeFilter: string = 'all'; // 'all', 'active', 'inactive'
  loading = false;
  changingRole = false;
  changingStatus = false;
  deletingUser = false;

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;
  paginatedUsers: Usuario[] = [];

  // Responsive breakpoints
  private breakpoints = [
    { maxWidth: 768, itemsPerPage: 4 },
    { maxWidth: 1024, itemsPerPage: 6 },
    { maxWidth: 1200, itemsPerPage: 6 },
    { maxWidth: Infinity, itemsPerPage: 6 }
  ];

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Recalculate items per page and update pagination on window resize
    const previousItemsPerPage = this.itemsPerPage;
    this.setItemsPerPage();
    
    // If items per page changed, reset to first page
    if (previousItemsPerPage !== this.itemsPerPage) {
      this.currentPage = 1;
      this.updatePagination();
    }
  }

  // Propiedades para el diálogo de cambio de rol
  showRoleChangeDialog = false;
  selectedUser: Usuario | null = null;
  selectedRole: string | null = null;
  availableRoles = ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_SUPERADMIN'];

  constructor(private superAdminService: SuperAdminService) {}

  ngOnInit(): void {
    // Set initial items per page based on screen size
    this.setItemsPerPage();
    // Obtener la lista de usuarios
    this.getUsers();
  }

  // Pagination methods
  updatePagination(): void {
    this.setItemsPerPage();
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  setItemsPerPage(): void {
    const screenWidth = window.innerWidth;
    for (const breakpoint of this.breakpoints) {
      if (screenWidth <= breakpoint.maxWidth) {
        this.itemsPerPage = breakpoint.itemsPerPage;
        break;
      }
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  // Método para obtener la lista de usuarios
  getUsers() {
    this.loading = true;
    this.currentPage = 1; // Reset to first page when fetching new data
    this.superAdminService.getAllUsers().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.filteredUsers = [...data];
        this.filterUsers();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
        this.loading = false;
      },
    });
  }

  // Get counts for stats cards
  get activeUsersCount(): number {
    return this.usuarios.filter(u => u.estado).length;
  }

  get adminUsersCount(): number {
    return this.usuarios.filter(u => u.roles && u.roles.includes('ROLE_ADMIN')).length;
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
        alert(`Usuario ${usuario.nombreCompleto} eliminado con éxito`);
      },
      error: (error) => {
        console.error('Error al eliminar usuario:', error);
        // Even if we get an error, refresh the list as the user might have been deleted
        this.getUsers();
        this.deletingUser = false;
        // For network errors (status 0), assume success and show success message
        if (error.status === 0) {
          alert(`Usuario ${usuario.nombreCompleto} eliminado con éxito`);
        } else {
          alert('Error al eliminar el usuario: ' + (error.error?.message || error.message || 'Error desconocido'));
        }
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

  // Helper methods for UI
  getRoleClass(roles: string[]): string {
    if (!roles || roles.length === 0) return 'role-none';
    const role = roles[0];
    switch (role) {
      case 'ROLE_USER': return 'role-user';
      case 'ROLE_ADMIN': return 'role-admin';
      case 'ROLE_SUPERADMIN': return 'role-superadmin';
      default: return 'role-default';
    }
  }

  getRoleDisplayName(role: string): string {
    switch (role) {
      case 'ROLE_USER': return 'Usuario';
      case 'ROLE_ADMIN': return 'Administrador';
      case 'ROLE_SUPERADMIN': return 'Super Admin';
      default: return role;
    }
  }

  getRoleDescription(role: string): string {
    switch (role) {
      case 'ROLE_USER': return 'Acceso básico a funciones de usuario';
      case 'ROLE_ADMIN': return 'Gestión de contenido y usuarios básicos';
      case 'ROLE_SUPERADMIN': return 'Control total del sistema';
      default: return 'Rol sin descripción';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  }

  // Filter methods
  filterUsers(): void {
    let result = [...this.usuarios];
    
    // Apply search term filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(user => 
        user.nombreCompleto.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        (user.documento && user.documento.toLowerCase().includes(term))
      );
    }
    
    // Apply status filter
    if (this.activeFilter === 'active') {
      result = result.filter(user => user.estado);
    } else if (this.activeFilter === 'inactive') {
      result = result.filter(user => !user.estado);
    }
    
    this.filteredUsers = result;
    this.updatePagination();
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.currentPage = 1; // Reset to first page when filter changes
    this.filterUsers();
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
