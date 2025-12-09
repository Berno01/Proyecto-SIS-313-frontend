/**
 * Modelo de Compra para enviar a la API (Request)
 * Representa la estructura completa de una compra con su detalle
 */
export interface CompraRequest {
  id_compra: number | null;
  nombre_proveedor: string;
  total_compra: number;
  detalle_compra: DetalleCompraRequest[];
}

/**
 * Modelo de Detalle de Compra para enviar a la API (Request)
 */
export interface DetalleCompraRequest {
  id_repuesto: number;
  cantidad: number;
  total: number;
  costo_repuesto: number;
}

/**
 * Modelo de respuesta de la API para una Compra (Response)
 * Representa la estructura que devuelve el backend
 */
export interface CompraResponse {
  idCompra: number;
  nombreProveedor: string;
  fechaCompra: number[]; // Array de 6 números: [año, mes, día, hora, min, seg]
  total: number;
  detalleCompra: DetalleCompraResponse[];
  estadoCompra: boolean;
}

/**
 * Modelo de respuesta de la API para el Detalle de Compra (Response)
 */
export interface DetalleCompraResponse {
  total: number;
  cantidad: number;
  idRepuesto: number;
  costoRepuesto: number;
}
