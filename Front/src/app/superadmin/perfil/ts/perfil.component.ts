import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerfilService } from '../perfil.service';
import { UsuarioDTO } from '../usuario.dto';
import { ActualizarPerfilDTO } from '../actualizar-perfil.dto';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-superadmin-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: '../html/perfil.component.html',
  styleUrls: ['../css/perfil.component.css'],
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
    fotoUrl: '',
  };

  constructor(private perfilService: PerfilService, private authService: AuthService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // Obtener el rol del usuario para mostrarlo en la UI
    this.userRole = this.authService.getUserRole();

    // Obtener información del token para depuración
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
        // Inicializar los datos de actualización con los valores actuales
        if (this.perfil) {
          this.updateData.nombreCompleto = this.perfil.nombreCompleto || '';
          this.updateData.telefono = this.perfil.telefono || '';
          this.updateData.documento = this.perfil.documento || '';
          this.updateData.email = this.perfil.email || '';
          this.updateData.fotoUrl = this.perfil.fotoUrl || '';
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
    // Si se entra en modo edición, inicializar los valores con los datos actuales del perfil
    if (this.editMode && this.perfil) {
      // Asegurarse de que los datos estén inicializados
      this.updateData.nombreCompleto = this.updateData.nombreCompleto || this.perfil.nombreCompleto || '';
      this.updateData.telefono = this.updateData.telefono || this.perfil.telefono || '';
      this.updateData.documento = this.updateData.documento || this.perfil.documento || '';
      this.updateData.email = this.updateData.email || this.perfil.email || '';
      this.updateData.fotoUrl = this.updateData.fotoUrl || this.perfil.fotoUrl || '';
    }
    // Si se cancela la edición, restaurar los valores originales
    else if (!this.editMode && this.perfil) {
      this.updateData.nombreCompleto = this.perfil.nombreCompleto || '';
      this.updateData.telefono = this.perfil.telefono || '';
      this.updateData.documento = this.perfil.documento || '';
      this.updateData.email = this.perfil.email || '';
      this.updateData.fotoUrl = this.perfil.fotoUrl || '';
      this.updateData.contrasena = '';
    }
  }

  toggleFieldEdit(field: string): void {
    if (this.editingField === field) {
      this.editingField = null;
      // Limpiar datos al cancelar
      this.updateData = {
        nombreCompleto: '',
        telefono: '',
        documento: '',
        email: '',
        contrasena: '',
        fotoUrl: '',
      };
    } else {
      this.editingField = field;
      // Inicializar el valor del campo que se va a editar
      if (this.perfil) {
        switch (field) {
          case 'nombreCompleto':
            this.updateData.nombreCompleto = this.perfil.nombreCompleto;
            break;
          case 'documento':
            this.updateData.documento = this.perfil.documento;
            break;
          case 'email':
            this.updateData.email = this.perfil.email;
            break;
          case 'telefono':
            this.updateData.telefono = this.perfil.telefono;
            break;
          case 'fotoUrl':
            this.updateData.fotoUrl = this.perfil.fotoUrl;
            break;
        }
      }
    }
  }

  saveField(field: string): void {
    console.log('Guardando campo:', field);
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
      case 'fotoUrl':
        if (this.updateData.fotoUrl) {
          dataToUpdate.fotoUrl = this.updateData.fotoUrl;
        }
        break;
    }

    console.log('Datos a actualizar:', dataToUpdate);

    if (Object.keys(dataToUpdate).length === 0) {
      alert('No hay cambios para actualizar.');
      return;
    }

    this.perfilService.updateProfile(dataToUpdate).subscribe({
      next: (updatedProfile: UsuarioDTO) => {
        console.log('Perfil actualizado recibido del backend:', updatedProfile);

        // Actualizar localmente el perfil con los datos devueltos por el backend
        this.perfil = updatedProfile;

        // Actualización optimista/manual para asegurar que la UI refleje el cambio inmediatamente
        // (útil si el backend devuelve el objeto sin actualizar o hay retraso)
        if (this.perfil) {
          console.log('Aplicando actualización manual local');
          this.perfil = { ...this.perfil, ...dataToUpdate };
          console.log('Nuevo estado del perfil local:', this.perfil);
        }

        this.editingField = null;
        this.cdr.detectChanges(); // Forzar detección de cambios
        alert('Campo actualizado correctamente.');
      },
      error: (err) => {
        console.error('Error al actualizar el campo:', err);
        alert('Error al actualizar el campo. Por favor, inténtelo más tarde.');
      },
    });
  }

  handleImageError(event: any): void {
    // Establecer una imagen por defecto si falla la carga de la imagen de perfil
    event.target.src =
      'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
  }

  togglePasswordChange(): void {
    this.showPasswordChange = !this.showPasswordChange;
    if (!this.showPasswordChange) {
      this.updateData.contrasena = '';
    }
  }

  updatePassword(): void {
    console.log('updatePassword called');
    console.log('Current password value:', this.updateData.contrasena);
    console.log('Password length:', this.updateData.contrasena ? this.updateData.contrasena.length : 0);

    if (!this.updateData.contrasena) {
      alert('Por favor, ingrese la nueva contraseña.');
      return;
    }

    if (this.updateData.contrasena.trim() === '') {
      alert('Por favor, ingrese una contraseña válida.');
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

    if (this.updateData.fotoUrl) {
      dataToUpdate.fotoUrl = this.updateData.fotoUrl;
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
}
