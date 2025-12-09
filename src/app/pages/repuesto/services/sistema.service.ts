import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Sistema, SistemaRequest } from '../models/sistema.model';
import { environment } from '../../../../environments/environment';

interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

/**
 * Servicio para gestionar las operaciones de Sistemas
 */
@Injectable({
  providedIn: 'root',
})
export class SistemaService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/sistemas`;

  /**
   * Obtiene todos los sistemas
   * @returns Observable con array de sistemas (camelCase)
   */
  getAll(): Observable<Sistema[]> {
    return this.http
      .get<ApiResponse<Sistema[]>>(`${this.baseUrl}/findAll`)
      .pipe(map((response) => response.data));
  }

  /**
   * Crea un nuevo sistema
   * @param sistema Datos del sistema a crear (nombre_sistema)
   * @returns Observable con el sistema creado (extraído de data)
   */
  create(sistema: SistemaRequest): Observable<Sistema> {
    return this.http
      .post<ApiResponse<Sistema>>(`${this.baseUrl}/create`, sistema)
      .pipe(map((response) => response.data));
  }
}
