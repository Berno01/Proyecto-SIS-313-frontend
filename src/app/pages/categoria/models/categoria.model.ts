/**
 * Modelo de datos para Categoría
 */

/**
 * Modelo para recibir datos de categoría desde la API (Response en camelCase)
 */
export interface Categoria {
  id: number | null;
  nombre: string;
}

/**
 * Modelo para enviar datos de categoría a la API (Request en snake_case)
 */
export interface CategoriaRequest {
  nombre_categoria: string;
}
