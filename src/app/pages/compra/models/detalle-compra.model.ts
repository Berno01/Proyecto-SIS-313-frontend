/**
 * Modelo de Detalle de Compra (para uso interno en el componente)
 * Representa cada línea de producto en una compra
 */
export interface DetalleCompra {
  id_repuesto: number;
  cantidad: number;
  costo_repuesto: number;
  total: number;
}
