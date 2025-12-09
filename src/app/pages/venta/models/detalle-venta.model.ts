/**
 * Modelo de Detalle de Venta
 * Representa cada línea de producto en una venta
 */
export interface DetalleVenta {
  id_repuesto: number;
  cantidad: number;
  precio_sugerido_repuesto: number;
  precio_unitario_repuesto: number;
  total: number;
  costo_repuesto: number;
}
