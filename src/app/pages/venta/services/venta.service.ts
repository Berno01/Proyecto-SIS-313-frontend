import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta } from '../models/venta.model';
import { VentaResponse } from '../models/venta-response.model';
import { environment } from '../../../../environments/environment';

/**
 * Servicio para gestionar operaciones relacionadas con Ventas
 */
@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private readonly API_URL = `${environment.apiUrl}/ventas`;

  constructor(private http: HttpClient) {}

  /**
   * Guarda una nueva venta en el sistema
   * @param venta - Objeto venta con sus detalles
   * @returns Observable con la respuesta del servidor
   */
  guardarVenta(venta: Venta): Observable<any> {
    return this.http.post<any>(this.API_URL, venta);
  }

  /**
   * Obtiene todas las ventas registradas
   * @returns Observable con array de ventas
   */
  getAllVentas(): Observable<VentaResponse[]> {
    return this.http.get<VentaResponse[]>(`${this.API_URL}/findAll`);
  }

  /**
   * Obtiene una venta específica por su ID
   * @param id - ID de la venta
   * @returns Observable con la venta encontrada o null
   */
  getVentaById(id: number): Observable<VentaResponse | null> {
    return this.http.get<VentaResponse | null>(`${this.API_URL}/findById/${id}`);
  }

  /**
   * Elimina una venta del sistema
   * @param id - ID de la venta a eliminar
   * @returns Observable con la respuesta del servidor
   */
  deleteVenta(id: number): Observable<any> {
    // The backend expects POST/DELETE to /api/ventas/delete/{id} and returns true/false
    // Use GET or DELETE as required by backend; here we call the delete path
    return this.http.get<boolean>(`${this.API_URL}/delete/${id}`);
  }

  /**
   * Actualiza una venta existente
   * @param venta - Objeto venta con id_venta definido
   * @returns Observable con la respuesta del servidor
   */
  updateVenta(venta: Venta): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/update`, venta);
  }
}
