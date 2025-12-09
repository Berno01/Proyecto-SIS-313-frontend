import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, Usuario } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isMenuOpen = false;
  isDropdownOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  /**
   * Obtiene el usuario actual
   */
  get usuarioActual(): Usuario | null {
    return this.authService.usuarioActual();
  }

  /**
   * Verifica si el usuario es ADMIN
   */
  get esAdmin(): boolean {
    return this.usuarioActual?.rol === 'ADMIN';
  }

  /**
   * Verifica si el usuario es VENDEDOR
   */
  get esVendedor(): boolean {
    return this.usuarioActual?.rol === 'VENDEDOR';
  }

  /**
   * Cierra la sesión del usuario
   */
  cerrarSesion(): void {
    this.authService.logout();
  }
}
