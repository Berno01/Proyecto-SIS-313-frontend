/**
 * Modelo de datos para Categoría
 */

/**
 * Modelo para recibir datos de categoría desde la API (Response en camelCase)
 */
export interface Categoria {
  idCategoria: number | null;
  nombreCategoria: string;
  estadoCategoria?: boolean;
}

/**
 * Modelo para enviar datos de categoría a la API (Request en snake_case)
 */
export interface CategoriaRequest {
  id_categoria: number | null;
  nombre_categoria: string;
  estado_categoria?: boolean;
}
