import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Interfaz para las credenciales de login
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Interfaz para la respuesta del backend (snake_case)
 */
interface UsuarioResponse {
  id_usuario: number;
  username: string;
  nombre_completo: string;
  rol: string;
}

/**
 * Interfaz para el usuario autenticado (camelCase para uso interno)
 */
export interface Usuario {
  id: number;
  id_usuario: number; // Mantener ambos para compatibilidad
  username: string;
  nombre_completo: string;
  rol: string;
}

/**
 * Servicio de autenticación
 * Maneja el login, logout y estado de sesión del usuario
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly STORAGE_KEY = 'usuario_sesion';
  private baseUrl = `${environment.apiUrl}/auth`;

  /**
   * Realiza el login del usuario
   * @param credentials Credenciales del usuario (username, password)
   * @returns Observable con los datos del usuario
   */
  login(credentials: LoginCredentials): Observable<Usuario> {
    return this.http.post<UsuarioResponse>(`${this.baseUrl}/login`, credentials).pipe(
      map((response) => {
        // Mapear respuesta del backend a formato interno
        const usuario: Usuario = {
          id: response.id_usuario,
          id_usuario: response.id_usuario,
          username: response.username,
          nombre_completo: response.nombre_completo,
          rol: response.rol,
        };
        // Guardar usuario en localStorage
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuario));
        return usuario;
      })
    );
  }

  /**
   * Cierra la sesión del usuario
   * Borra el localStorage y redirige a /login
   */
  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  /**
   * Obtiene el usuario actual desde localStorage
   * @returns Usuario actual o null si no hay sesión
   */
  usuarioActual(): Usuario | null {
    const usuarioJson = localStorage.getItem(this.STORAGE_KEY);
    if (usuarioJson) {
      try {
        return JSON.parse(usuarioJson);
      } catch (e) {
        // Si hay error al parsear, limpiar el storage
        localStorage.removeItem(this.STORAGE_KEY);
        return null;
      }
    }
    return null;
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns true si hay sesión activa, false en caso contrario
   */
  estaAutenticado(): boolean {
    return this.usuarioActual() !== null;
  }
}
