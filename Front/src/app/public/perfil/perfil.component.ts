import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerfilService } from './perfil.service';
import { UsuarioDTO } from './usuario.dto';
import { ActualizarPerfilDTO } from './actualizar-perfil.dto';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  perfil: UsuarioDTO | null = null;
  loading = false;
  error: string | null = null;
  userRole: string | null = null;
  tokenInfo: any = null;
  editMode = false;
  editingField: string | null = null;
  showPasswordChange = false;
  updateData: ActualizarPerfilDTO = {
    nombreCompleto: '',
    telefono: '',
    documento: '',
    email: '',
    contrasena: '',
  };

  constructor(private perfilService: PerfilService, private authService: AuthService) {}

  ngOnInit(): void {
    // Obtener el rol del usuario para mostrarlo en la UI
    this.userRole = this.authService.getUserRole();

    // Obtener información del token para depuración
    const token = this.authService.getToken();
    if (token) {
      try {
        this.tokenInfo = this.authService.decodeToken(token);
        console.log('PerfilComponent: Información del token:', this.tokenInfo);
      } catch (e) {
        console.error('PerfilComponent: Error al decodificar el token:', e);
      }
    }

    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.error = null;

    this.perfilService.getProfile().subscribe({
      next: (data: UsuarioDTO) => {
        this.perfil = data;
        this.loading = false;
        // Inicializar los datos de actualización con los valores actuales
        if (this.perfil) {
          this.updateData.nombreCompleto = this.perfil.nombreCompleto || '';
          this.updateData.telefono = this.perfil.telefono || '';
          this.updateData.documento = this.perfil.documento || '';
          this.updateData.email = this.perfil.email || '';
        }
      },
      error: (err) => {
        console.error('Error al cargar el perfil de usuario:', err);

        // Manejo específico del error 403
        if (err.status === 403) {
          let errorMsg = 'No tiene permisos para acceder a esta información.\n';
          errorMsg += 'Posibles causas:\n';
          errorMsg += '- Su rol de usuario no tiene acceso al perfil de usuario\n';
          errorMsg += `- Su rol actual es: ${this.userRole || 'No identificado'}\n`;

          if (this.tokenInfo && this.tokenInfo.roles) {
            errorMsg += `- Roles en el token: ${this.tokenInfo.roles.join(', ')}\n`;
          }

          errorMsg += '\nPor favor, contacte al administrador del sistema.';
          this.error = errorMsg;
        } else {
          this.error =
            'No se pudo cargar la información del perfil de usuario. Por favor, inténtelo más tarde.';
        }

        this.loading = false;
      },
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    // Si se cancela la edición, restaurar los valores originales
    if (!this.editMode && this.perfil) {
      this.updateData.nombreCompleto = this.perfil.nombreCompleto || '';
      this.updateData.telefono = this.perfil.telefono || '';
      this.updateData.documento = this.perfil.documento || '';
      this.updateData.email = this.perfil.email || '';
      this.updateData.contrasena = '';
    }
  }

  toggleFieldEdit(field: string): void {
    if (this.editingField === field) {
      this.editingField = null;
      // Restaurar el valor original si se cancela
      if (this.perfil) {
        switch (field) {
          case 'nombreCompleto':
            this.updateData.nombreCompleto = this.perfil.nombreCompleto || '';
            break;
          case 'telefono':
            this.updateData.telefono = this.perfil.telefono || '';
            break;
          case 'documento':
            this.updateData.documento = this.perfil.documento || '';
            break;
          case 'email':
            this.updateData.email = this.perfil.email || '';
            break;
        }
      }
    } else {
      this.editingField = field;
    }
  }

  saveField(field: string): void {
    const dataToUpdate: ActualizarPerfilDTO = {};

    switch (field) {
      case 'nombreCompleto':
        if (this.updateData.nombreCompleto) {
          dataToUpdate.nombreCompleto = this.updateData.nombreCompleto;
        }
        break;
      case 'telefono':
        if (this.updateData.telefono) {
          dataToUpdate.telefono = this.updateData.telefono;
        }
        break;
      case 'documento':
        if (this.updateData.documento) {
          dataToUpdate.documento = this.updateData.documento;
        }
        break;
      case 'email':
        if (this.updateData.email) {
          dataToUpdate.email = this.updateData.email;
        }
        break;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      alert('No hay cambios para actualizar.');
      return;
    }

    this.perfilService.updateProfile(dataToUpdate).subscribe({
      next: (updatedProfile: UsuarioDTO) => {
        this.perfil = updatedProfile;
        this.editingField = null;
        alert('Campo actualizado correctamente.');
      },
      error: (err) => {
        console.error('Error al actualizar el campo:', err);
        alert('Error al actualizar el campo. Por favor, inténtelo más tarde.');
      },
    });
  }

  togglePasswordChange(): void {
    this.showPasswordChange = !this.showPasswordChange;
    if (!this.showPasswordChange) {
      this.updateData.contrasena = '';
    }
  }

  updatePassword(): void {
    if (!this.updateData.contrasena) {
      alert('Por favor, ingrese la nueva contraseña.');
      return;
    }

    const dataToUpdate: ActualizarPerfilDTO = {
      contrasena: this.updateData.contrasena,
    };

    this.perfilService.updateProfile(dataToUpdate).subscribe({
      next: (updatedProfile: UsuarioDTO) => {
        this.perfil = updatedProfile;
        this.showPasswordChange = false;
        this.updateData.contrasena = '';
        alert('Contraseña actualizada correctamente.');
      },
      error: (err) => {
        console.error('Error al actualizar la contraseña:', err);
        alert('Error al actualizar la contraseña. Por favor, inténtelo más tarde.');
      },
    });
  }

  updateProfile(): void {
    // Filtrar solo los campos que tienen valores para actualizar
    const dataToUpdate: ActualizarPerfilDTO = {};

    if (this.updateData.nombreCompleto) {
      dataToUpdate.nombreCompleto = this.updateData.nombreCompleto;
    }

    if (this.updateData.telefono) {
      dataToUpdate.telefono = this.updateData.telefono;
    }

    if (this.updateData.documento) {
      dataToUpdate.documento = this.updateData.documento;
    }

    if (this.updateData.email) {
      dataToUpdate.email = this.updateData.email;
    }

    if (this.updateData.contrasena) {
      dataToUpdate.contrasena = this.updateData.contrasena;
    }

    // Si no hay datos para actualizar, mostrar un mensaje
    if (Object.keys(dataToUpdate).length === 0) {
      alert('No hay cambios para actualizar.');
      return;
    }

    this.perfilService.updateProfile(dataToUpdate).subscribe({
      next: (updatedProfile: UsuarioDTO) => {
        this.perfil = updatedProfile;
        this.editMode = false;
        alert('Perfil actualizado correctamente.');
      },
      error: (err) => {
        console.error('Error al actualizar el perfil:', err);
        alert('Error al actualizar el perfil. Por favor, inténtelo más tarde.');
      },
    });
  }

  onDeleteAccount(): void {
    if (
      confirm(
        '¿Está seguro que desea eliminar su cuenta de usuario? Esta acción no se puede deshacer.'
      )
    ) {
      this.perfilService.deleteProfile().subscribe({
        next: (response: string) => {
          alert('Cuenta de usuario eliminada correctamente');
          // Aquí podrías redirigir al usuario a la página de login
          // this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error al eliminar la cuenta de usuario:', err);

          // Manejo específico del error 403
          if (err.status === 403) {
            let errorMsg = 'No tiene permisos para eliminar la cuenta de usuario.\n';
            errorMsg += 'Posibles causas:\n';
            errorMsg += '- Su rol de usuario no tiene permiso para esta acción\n';
            errorMsg += `- Su rol actual es: ${this.userRole || 'No identificado'}\n`;

            if (this.tokenInfo && this.tokenInfo.roles) {
              errorMsg += `- Roles en el token: ${this.tokenInfo.roles.join(', ')}\n`;
            }

            errorMsg += '\nPor favor, contacte al administrador del sistema.';
            alert(errorMsg);
          } else {
            alert('Error al eliminar la cuenta de usuario. Por favor, inténtelo más tarde.');
          }
        },
      });
    }
  }
}
