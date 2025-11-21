/**
 * Modelo de Repuesto
 * Representa la estructura de un repuesto obtenido desde la API
 */
export interface Repuesto {
  idRepuesto: number;
  nombreRepuesto: string;
  costoRepuesto: number;
  stockRepuesto: number;
  precioSugerido: number;
}
