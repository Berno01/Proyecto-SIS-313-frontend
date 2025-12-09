import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Repuesto } from '../models/repuesto.model';
import { environment } from '../../../../environments/environment';

/**
 * Servicio para gestionar operaciones relacionadas con Repuestos
 */
@Injectable({
  providedIn: 'root',
})
export class RepuestoService {
  private readonly API_URL = `${environment.apiUrl}/ventas/repuesto`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista completa de repuestos
   * @returns Observable con array de repuestos
   */
  getRepuestos(): Observable<Repuesto[]> {
    return this.http.get<Repuesto[]>(`${this.API_URL}/findAll`);
  }

  /**
   * Obtiene un repuesto específico por su ID
   * @param id - ID del repuesto
   * @returns Observable con el repuesto encontrado
   */
  getRepuestoById(id: number): Observable<Repuesto> {
    return this.http.get<Repuesto>(`${this.API_URL}/findById/${id}`);
  }
}
