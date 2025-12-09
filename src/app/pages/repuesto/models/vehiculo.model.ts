/**
 * Modelo de datos para Vehículo
 */

/**
 * Modelo para recibir datos de vehículo desde la API (Response en camelCase)
 */
export interface Vehiculo {
  id: number | null;
  marca: string;
  modelo: string;
}

/**
 * Request para crear/actualizar vehículo (solo marca y modelo)
 */
export interface VehiculoRequest {
  marca: string;
  modelo: string;
}
