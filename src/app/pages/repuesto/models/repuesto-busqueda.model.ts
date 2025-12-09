/**
 * DTO para búsqueda inteligente de repuestos
 * Contiene campos optimizados para búsqueda client-side
 */
export interface RepuestoBusquedaDTO {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  sistema: string;
  compatibilidad_resumen: string;
  search_index: string; // Campo para búsqueda, no mostrar en UI
}
