/**
 * Modelo de respuesta de la API para una Venta
 * Representa la estructura que devuelve el backend
 */
export interface VentaResponse {
  idVenta: number;
  nombreCliente: string;
  fechaVenta: number[]; // Array de 6 números: [año, mes, día, hora, min, seg]
  total: number;
  descuentoTotal: number;
  detalleVenta: DetalleVentaResponse[];
}

/**
 * Modelo de respuesta de la API para el Detalle de Venta
 */
export interface DetalleVentaResponse {
  total: number;
  cantidad: number;
  precioUnitarioRepuesto: number;
  precioSugeridoRepuesto: number;
  descuento: number | null;
  idRepuesto: number;
  costoRepuesto: number;
}
