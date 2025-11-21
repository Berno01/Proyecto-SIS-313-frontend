import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompraRequest, CompraResponse } from '../models/compra.model';

/**
 * Servicio para gestionar operaciones relacionadas con Compras
 */
@Injectable({
  providedIn: 'root',
})
export class CompraService {
  private readonly API_URL = 'http://localhost:8080/api/compras';

  constructor(private http: HttpClient) {}

  /**
   * Guarda una nueva compra en el sistema
   * @param compra - Objeto compra con sus detalles
   * @returns Observable con la respuesta del servidor
   */
  crearCompra(compra: CompraRequest): Observable<any> {
    return this.http.post<any>(this.API_URL, compra);
  }

  /**
   * Obtiene todas las compras registradas
   * @returns Observable con array de compras
   */
  getAllCompras(): Observable<CompraResponse[]> {
    return this.http.get<CompraResponse[]>(`${this.API_URL}/findAll`);
  }

  /**
   * Obtiene una compra específica por su ID
   * @param id - ID de la compra
   * @returns Observable con la compra encontrada
   */
  getCompraById(id: number): Observable<CompraResponse> {
    return this.http.get<CompraResponse>(`${this.API_URL}/findById/${id}`);
  }

  /**
   * Actualiza una compra existente
   * @param compra - Objeto compra con id_compra definido
   * @returns Observable con la respuesta del servidor
   */
  actualizarCompra(compra: CompraRequest): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/update`, compra);
  }

  /**
   * Elimina una compra del sistema
   * @param id - ID de la compra a eliminar
   * @returns Observable con true si se eliminó correctamente
   */
  eliminarCompra(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.API_URL}/delete/${id}`);
  }
}
