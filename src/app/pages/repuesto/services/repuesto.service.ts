import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Repuesto, RepuestoRequest, RepuestoResponse } from '../models/repuesto.model';
import { RepuestoBusquedaDTO } from '../models/repuesto-busqueda.model';
import {
  RepuestoCompleto,
  RepuestoCompletoRequest,
  Compatibilidad,
} from '../models/repuesto-completo.model';
import { environment } from '../../../../environments/environment';

/**
 * Respuesta genérica de la API
 */
interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

/**
 * Servicio para gestionar las operaciones CRUD de Repuestos
 */
@Injectable({
  providedIn: 'root',
})
export class RepuestoService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/repuesto`;

  /**
   * Obtiene todos los repuestos
   * @returns Observable con array de repuestos (camelCase)
   */
  getAllRepuestos(): Observable<RepuestoResponse[]> {
    return this.http.get<RepuestoResponse[]>(`${this.baseUrl}/findAll`);
  }

  /**
   * Obtiene catálogo de repuestos optimizado para búsqueda
   * @returns Observable con array de repuestos con índice de búsqueda
   */
  obtenerCatalogoBusqueda(): Observable<RepuestoBusquedaDTO[]> {
    return this.http.get<RepuestoBusquedaDTO[]>(`${this.baseUrl}/catalogo-search`);
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
   * Obtiene un repuesto completo por su ID (con compatibilidades)
   * @param id ID del repuesto
   * @returns Observable con el repuesto completo
   */
  getRepuestoCompletoById(id: number): Observable<RepuestoCompleto> {
    return this.http.get<RepuestoCompleto>(`${this.baseUrl}/findById/${id}`);
  }

  /**
   * Crea un nuevo repuesto completo (con compatibilidades)
   * @param repuesto Datos del repuesto completo
   * @returns Observable con el repuesto creado
   */
  crearRepuestoCompleto(repuesto: RepuestoCompleto): Observable<RepuestoCompleto> {
    const request = this.convertirRepuestoCompletoASnakeCaseParaCrear(repuesto);
    return this.http
      .post<ApiResponse<RepuestoCompleto>>(`${this.baseUrl}`, request)
      .pipe(map((response) => response.data));
  }

  /**
   * Actualiza un repuesto completo existente (con compatibilidades)
   * @param repuesto Datos del repuesto completo a actualizar
   * @returns Observable con el repuesto actualizado
   */
  actualizarRepuestoCompleto(repuesto: RepuestoCompleto): Observable<RepuestoCompleto> {
    const request = this.convertirRepuestoCompletoASnakeCase(repuesto);
    return this.http
      .post<ApiResponse<RepuestoCompleto>>(`${this.baseUrl}/update`, request)
      .pipe(map((response) => response.data));
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

  /**
   * Convierte RepuestoCompleto a formato snake_case para el backend (con id_repuesto)
   * @param repuesto Objeto en camelCase
   * @returns Objeto en snake_case
   */
  private convertirRepuestoCompletoASnakeCase(
    repuesto: RepuestoCompleto
  ): any {
    return {
      id_repuesto: repuesto.idRepuesto,
      nombre_repuesto: repuesto.nombreRepuesto,
      stock_actual: repuesto.stockActual,
      costo_repuesto: repuesto.costoRepuesto,
      precio_sugerido: repuesto.precioSugerido,
      estado_repuesto: repuesto.estadoRepuesto,
      tags_busqueda: repuesto.tagsBusqueda,
      id_sistema: repuesto.idSistema ? Number(repuesto.idSistema) : null,
      ids_categorias: repuesto.idsCategorias,
      compatibilidades: repuesto.compatibilidades.map((c) => ({
        vehiculo_id: Number(c.vehiculoId),
        anio_inicio: c.anioInicio || null,
        anio_fin: c.anioFin || null,
        notas: c.notas || '',
      })),
    };
  }

  /**
   * Convierte RepuestoCompleto a formato snake_case para crear (sin id_repuesto)
   * @param repuesto Objeto en camelCase
   * @returns Objeto en snake_case
   */
  private convertirRepuestoCompletoASnakeCaseParaCrear(
    repuesto: RepuestoCompleto
  ): any {
    return {
      nombre_repuesto: repuesto.nombreRepuesto,
      stock_actual: repuesto.stockActual,
      costo_repuesto: repuesto.costoRepuesto,
      precio_sugerido: repuesto.precioSugerido,
      estado_repuesto: repuesto.estadoRepuesto,
      tags_busqueda: repuesto.tagsBusqueda,
      id_sistema: repuesto.idSistema ? Number(repuesto.idSistema) : null,
      ids_categorias: repuesto.idsCategorias,
      compatibilidades: repuesto.compatibilidades.map((c) => ({
        vehiculo_id: Number(c.vehiculoId),
        anio_inicio: c.anioInicio || null,
        anio_fin: c.anioFin || null,
        notas: c.notas || '',
      })),
    };
  }
}
