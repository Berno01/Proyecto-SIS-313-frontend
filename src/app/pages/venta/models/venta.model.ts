import { DetalleVenta } from './detalle-venta.model';

/**
 * Modelo de Venta
 * Representa la estructura completa de una venta con su detalle
 */
export interface Venta {
  id_venta: number | null;
  nombre_cliente: string;
  total_venta: number;
  detalle_venta: DetalleVenta[];
}
