import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria, CategoriaRequest } from '../models/categoria.model';

/**
 * Servicio para gestionar las operaciones CRUD de Categorías
 */
@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/categoria';

  /**
   * Obtiene todas las categorías
   * @returns Observable con array de categorías (camelCase)
   */
  getAllCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseUrl}/findAll`);
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
   * Crea una nueva categoría
   * @param categoria Datos de la categoría a crear (camelCase)
   * @returns Observable con la respuesta del servidor
   */
  crearCategoria(categoria: Categoria): Observable<any> {
    const request = this.toSnakeCase(categoria);
    return this.http.post(`${this.baseUrl}`, request);
  }

  /**
   * Actualiza una categoría existente
   * @param categoria Datos de la categoría a actualizar (camelCase)
   * @returns Observable con la respuesta del servidor
   */
  actualizarCategoria(categoria: Categoria): Observable<any> {
    const request = this.toSnakeCase(categoria);
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

  /**
   * Convierte objeto Categoria (camelCase) a CategoriaRequest (snake_case)
   * @param categoria Objeto en camelCase
   * @returns Objeto en snake_case para enviar al backend
   */
  private toSnakeCase(categoria: Categoria): CategoriaRequest {
    return {
      id_categoria: categoria.idCategoria,
      nombre_categoria: categoria.nombreCategoria,
      estado_categoria: categoria.estadoCategoria,
    };
  }
}
