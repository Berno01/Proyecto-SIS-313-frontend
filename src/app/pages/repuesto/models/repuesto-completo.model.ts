/**
 * Modelo para compatibilidad de repuesto con vehículos
 */
export interface Compatibilidad {
  vehiculoId: number;
  anioInicio?: number | null;
  anioFin?: number | null;
  notas?: string;
}

/**
 * Modelo para enviar compatibilidad al backend (snake_case)
 */
export interface CompatibilidadRequest {
  vehiculo_id: number;
  anio_inicio?: number | null;
  anio_fin?: number | null;
  notas?: string;
}

/**
 * Modelo completo de repuesto para crear/editar (con compatibilidades)
 */
export interface RepuestoCompleto {
  idRepuesto: number | null;
  nombreRepuesto: string;
  stockActual: number;
  costoRepuesto: number;
  precioSugerido: number;
  estadoRepuesto: boolean;
  tagsBusqueda?: string;
  idSistema?: number | null;
  idsCategorias: number[];
  compatibilidades: Compatibilidad[];
}

/**
 * Modelo para enviar repuesto al backend (snake_case)
 */
export interface RepuestoCompletoRequest {
  id_repuesto: number | null;
  nombre_repuesto: string;
  stock_actual: number;
  costo_repuesto: number;
  precio_sugerido: number;
  estado_repuesto: boolean;
  tags_busqueda?: string;
  id_sistema?: number | null;
  ids_categorias: number[];
  compatibilidades: CompatibilidadRequest[];
}
