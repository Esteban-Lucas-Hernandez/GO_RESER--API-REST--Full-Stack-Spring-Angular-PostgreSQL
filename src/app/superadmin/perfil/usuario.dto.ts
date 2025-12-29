export interface UsuarioDTO {
  id: number;
  nombreCompleto: string;
  email: string;
  telefono: string;
  documento: string;
  rol: string;
  fechaRegistro: string;
  fotoUrl?: string;
}
