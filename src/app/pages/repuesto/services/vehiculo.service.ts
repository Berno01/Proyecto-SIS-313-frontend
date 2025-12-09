import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Vehiculo, VehiculoRequest } from '../models/vehiculo.model';
import { environment } from '../../../../environments/environment';

interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

/**
 * Servicio para gestionar las operaciones de Vehículos
 */
@Injectable({
  providedIn: 'root',
})
export class VehiculoService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/vehiculos`;

  /**
   * Obtiene todos los vehículos
   * @returns Observable con array de vehículos (camelCase)
   */
  getAll(): Observable<Vehiculo[]> {
    return this.http
      .get<ApiResponse<Vehiculo[]>>(`${this.baseUrl}/findAll`)
      .pipe(map((response) => response.data));
  }

  /**
   * Crea un nuevo vehículo
   * @param vehiculo Datos del vehículo a crear (marca, modelo)
   * @returns Observable con el vehículo creado (extraído de data)
   */
  create(vehiculo: VehiculoRequest): Observable<Vehiculo> {
    return this.http
      .post<ApiResponse<Vehiculo>>(`${this.baseUrl}/create`, vehiculo)
      .pipe(map((response) => response.data));
  }
}
