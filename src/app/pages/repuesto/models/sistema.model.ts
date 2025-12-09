/**
 * Modelo de datos para Sistema
 */

/**
 * Modelo para recibir datos de sistema desde la API (Response en camelCase)
 */
export interface Sistema {
  id: number | null;
  nombre: string;
}

/**
 * Request para crear/actualizar sistema (solo nombre_sistema)
 */
export interface SistemaRequest {
  nombre_sistema: string;
}
