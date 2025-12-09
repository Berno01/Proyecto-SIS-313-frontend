import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Interfaz para las credenciales de login
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Interfaz para el usuario autenticado
 */
export interface Usuario {
  id: number;
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
    return this.http.post<Usuario>(`${this.baseUrl}/login`, credentials).pipe(
      tap((usuario) => {
        // Guardar usuario en localStorage
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuario));
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
