import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerfilService } from './perfil.service';
import { UsuarioDTO, ActualizarPerfilDTO } from './usuario.dto';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-superadmin-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class SuperAdminPerfilComponent implements OnInit {
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
    this.userRole = this.authService.getUserRole();

    const token = this.authService.getToken();
    if (token) {
      try {
        this.tokenInfo = this.authService.decodeToken(token);
        console.log('SuperAdminPerfilComponent: Información del token:', this.tokenInfo);
      } catch (e) {
        console.error('SuperAdminPerfilComponent: Error al decodificar el token:', e);
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
        if (this.perfil) {
          this.updateData.nombreCompleto = this.perfil.nombreCompleto || '';
          this.updateData.telefono = this.perfil.telefono || '';
          this.updateData.documento = this.perfil.documento || '';
          this.updateData.email = this.perfil.email || '';
        }
      },
      error: (err: any) => {
        console.error('Error al cargar el perfil de superadministrador:', err);

        if (err.status === 403) {
          let errorMsg = 'No tiene permisos para acceder a esta información.\n';
          errorMsg += 'Posibles causas:\n';
          errorMsg += '- Su rol de usuario no tiene acceso al perfil de superadministrador\n';
          errorMsg += `- Su rol actual es: ${this.userRole || 'No identificado'}\n`;

          if (this.tokenInfo && this.tokenInfo.roles) {
            errorMsg += `- Roles en el token: ${this.tokenInfo.roles.join(', ')}\n`;
          }

          errorMsg += '\nPor favor, contacte al administrador del sistema.';
          this.error = errorMsg;
        } else {
          this.error =
            'No se pudo cargar la información del perfil de superadministrador. Por favor, inténtelo más tarde.';
        }

        this.loading = false;
      },
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
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
      error: (err: any) => {
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
      error: (err: any) => {
        console.error('Error al actualizar la contraseña:', err);
        alert('Error al actualizar la contraseña. Por favor, inténtelo más tarde.');
      },
    });
  }

  updateProfile(): void {
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
      error: (err: any) => {
        console.error('Error al actualizar el perfil:', err);
        alert('Error al actualizar el perfil. Por favor, inténtelo más tarde.');
      },
    });
  }
}
