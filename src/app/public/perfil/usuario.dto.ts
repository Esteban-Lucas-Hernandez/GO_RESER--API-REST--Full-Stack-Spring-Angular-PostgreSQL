export interface UsuarioDTO {
  id: number;
  nombreCompleto: string;
  telefono: string;
  documento: string;
  email: string;
  rol: string;
  fechaRegistro: string;
  fotoUrl?: string;
}
