import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Categoria, CategoriaRequest } from '../models/categoria.model';
import { environment } from '../../../../environments/environment';

/**
 * Respuesta genérica de la API con data
 */
interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

/**
 * Servicio para gestionar las operaciones CRUD de Categorías
 */
@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/categorias`;

  /**
   * Obtiene todas las categorías
   * @returns Observable con array de categorías (camelCase)
   */
  getAllCategorias(): Observable<Categoria[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/findAll`).pipe(
      map((response) =>
        response.data.map((cat: any) => ({
          id: cat.idCategoria || cat.id,
          nombre: cat.nombreCategoria || cat.nombre,
        }))
      )
    );
  }

  /**
   * Alias para compatibilidad con componentes modales
   * @returns Observable con array de categorías
   */
  getAll(): Observable<Categoria[]> {
    return this.getAllCategorias();
  }

  /**
   * Obtiene una categoría por su ID
   * @param id ID de la categoría
   * @returns Observable con la categoría encontrada (camelCase)
   */
  getCategoriaById(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.baseUrl}/findById/${id}`);
  }

  /**
   * Crea una nueva categoría (para usar en modales)
   * @param categoria Datos de la categoría a crear (nombre_categoria)
   * @returns Observable con la categoría creada (extraído de data)
   */
  create(categoria: CategoriaRequest): Observable<Categoria> {
    return this.http
      .post<ApiResponse<Categoria>>(`${this.baseUrl}/create`, categoria)
      .pipe(map((response) => response.data));
  }

  /**
   * Crea una nueva categoría
   * @param categoria Datos de la categoría a crear (camelCase)
   * @returns Observable con la respuesta del servidor
   */
  crearCategoria(categoria: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, categoria);
  }

  /**
   * Actualiza una categoría existente
   * @param categoria Datos de la categoría a actualizar (camelCase)
   * @returns Observable con la respuesta del servidor
   */
  actualizarCategoria(categoria: Categoria): Observable<any> {
    const request = {
      id_categoria: categoria.id,
      nombre_categoria: categoria.nombre,
      estado_categoria: true,
    };
    return this.http.post(`${this.baseUrl}/update`, request);
  }

  /**
   * Elimina (desactiva) una categoría
   * @param id ID de la categoría a eliminar
   * @returns Observable con la respuesta del servidor
   */
  eliminarCategoria(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/delete/${id}`);
  }
}
