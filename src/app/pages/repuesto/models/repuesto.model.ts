/**
 * Modelos de datos para Repuesto
 */

/**
 * Modelo para recibir datos de repuesto desde la API (Response en camelCase)
 */
export interface RepuestoResponse {
  idRepuesto: number;
  nombreRepuesto: string;
  stockActual: number;
  costoRepuesto: number;
  precioSugerido: number;
  estadoRepuesto: boolean;
  categorias?: CategoriaSimple[];
  idsCategorias?: number[];
}

/**
 * Modelo para trabajar con repuesto en el frontend (camelCase)
 */
export interface Repuesto {
  idRepuesto: number | null;
  nombreRepuesto: string;
  stockActual: number;
  costoRepuesto: number;
  precioSugerido: number;
  estadoRepuesto: boolean;
  idsCategorias: number[];
}

/**
 * Modelo para enviar datos de repuesto a la API (Request en snake_case)
 */
export interface RepuestoRequest {
  id_repuesto: number | null;
  nombre_repuesto: string;
  stock_actual: number;
  costo_repuesto: number;
  precio_sugerido: number;
  estado_repuesto: boolean;
  ids_categorias: number[];
}

/**
 * Modelo simplificado de categoría
 */
export interface CategoriaSimple {
  idCategoria: number;
  nombreCategoria: string;
}
