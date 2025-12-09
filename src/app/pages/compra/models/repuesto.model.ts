/**
 * Modelo de Repuesto (compartido con el módulo de ventas)
 * Representa un repuesto en el sistema
 */
export interface Repuesto {
  idRepuesto: number;
  nombreRepuesto: string;
  descripcionRepuesto: string;
  stockRepuesto: number;
  costoRepuesto: number;
  precioSugerido: number;
  idCategoria: number;
  estado: boolean;
}
