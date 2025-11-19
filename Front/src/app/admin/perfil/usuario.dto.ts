export interface UsuarioDTO {
  id: number;
  nombreCompleto: string;
  email: string;
  telefono: string;
  documento: string;
  rol: string;
  fechaRegistro: string;
}

export interface ActualizarPerfilDTO {
  nombreCompleto?: string;
  telefono?: string;
  documento?: string;
  email?: string;
  contrasena?: string;
}
