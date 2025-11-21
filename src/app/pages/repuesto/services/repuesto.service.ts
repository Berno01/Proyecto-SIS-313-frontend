import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Repuesto, RepuestoRequest, RepuestoResponse } from '../models/repuesto.model';

/**
 * Servicio para gestionar las operaciones CRUD de Repuestos
 */
@Injectable({
  providedIn: 'root',
})
export class RepuestoService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/repuesto';

  /**
   * Obtiene todos los repuestos
   * @returns Observable con array de repuestos (camelCase)
   */
  getAllRepuestos(): Observable<RepuestoResponse[]> {
    return this.http.get<RepuestoResponse[]>(`${this.baseUrl}/findAll`);
  }

  /**
   * Obtiene un repuesto por su ID
   * @param id ID del repuesto
   * @returns Observable con el repuesto encontrado (camelCase)
   */
  getRepuestoById(id: number): Observable<RepuestoResponse> {
    return this.http.get<RepuestoResponse>(`${this.baseUrl}/findById/${id}`);
  }

  /**
   * Crea un nuevo repuesto
   * @param repuesto Datos del repuesto a crear (camelCase)
   * @returns Observable con la respuesta del servidor
   */
  crearRepuesto(repuesto: Repuesto): Observable<any> {
    const request = this.toSnakeCase(repuesto);
    return this.http.post(`${this.baseUrl}`, request);
  }

  /**
   * Actualiza un repuesto existente
   * @param repuesto Datos del repuesto a actualizar (camelCase)
   * @returns Observable con la respuesta del servidor
   */
  actualizarRepuesto(repuesto: Repuesto): Observable<any> {
    const request = this.toSnakeCase(repuesto);
    return this.http.post(`${this.baseUrl}/update`, request);
  }

  /**
   * Elimina (desactiva) un repuesto
   * @param id ID del repuesto a eliminar
   * @returns Observable con la respuesta del servidor
   */
  eliminarRepuesto(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/delete/${id}`);
  }

  /**
   * Convierte objeto Repuesto (camelCase) a RepuestoRequest (snake_case)
   * @param repuesto Objeto en camelCase
   * @returns Objeto en snake_case para enviar al backend
   */
  private toSnakeCase(repuesto: Repuesto): RepuestoRequest {
    return {
      id_repuesto: repuesto.idRepuesto,
      nombre_repuesto: repuesto.nombreRepuesto,
      stock_actual: repuesto.stockActual,
      costo_repuesto: repuesto.costoRepuesto,
      precio_sugerido: repuesto.precioSugerido,
      estado_repuesto: repuesto.estadoRepuesto,
      ids_categorias: repuesto.idsCategorias,
    };
  }
}
