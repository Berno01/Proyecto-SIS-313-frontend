import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VentaService } from '../venta/services/venta.service';
import { VentaResponse } from '../venta/models/venta-response.model';
import { formatFechaVenta } from '../venta/utils/date-formatter';
import { AuthService } from '../../services/auth.service';

/**
 * Componente para mostrar el historial de ventas
 */
@Component({
  selector: 'app-ventas-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ventas-list.component.html',
  styleUrls: ['./ventas-list.component.css'],
})
export class VentasListComponent implements OnInit {
  ventas: VentaResponse[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(
    private ventaService: VentaService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarVentas();
  }

  /**
   * Verifica si el usuario actual es ADMIN
   */
  get esAdmin(): boolean {
    const usuario = this.authService.usuarioActual();
    return usuario?.rol === 'ADMIN';
  }

  /**
   * Carga todas las ventas desde la API
   */
  cargarVentas(): void {
    this.loading = true;
    this.error = '';

    this.ventaService.getAllVentas().subscribe({
      next: (data) => {
        this.ventas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar ventas:', err);
        this.error = 'Error al cargar las ventas. Por favor, intente nuevamente.';
        this.loading = false;
      },
    });
  }

  /**
   * Navega al formulario para crear una nueva venta
   */
  nuevaVenta(): void {
    this.router.navigate(['/venta']);
  }

  /**
   * Navega al formulario para editar una venta existente
   * @param id - ID de la venta a editar
   */
  editarVenta(id: number): void {
    this.router.navigate(['/venta', id]);
  }

  /**
   * Muestra confirmación y elimina una venta
   * @param id - ID de la venta a eliminar
   */
  eliminarVenta(id: number): void {
    if (confirm('¿Está seguro de eliminar esta venta?')) {
      this.loading = true;

      this.ventaService.deleteVenta(id).subscribe({
        next: (result) => {
          // backend returns true/false
          if (result === true) {
            console.log('Venta eliminada:', id);
            // Recargar la lista después de eliminar
            this.cargarVentas();
          } else {
            console.warn('El backend devolvió false al eliminar la venta:', id);
            this.error = 'No se pudo eliminar la venta. Intente nuevamente.';
            this.loading = false;
          }
        },
        error: (err) => {
          console.error('Error al eliminar venta:', err);
          this.error = 'Error al eliminar la venta. Por favor, intente nuevamente.';
          this.loading = false;
        },
      });
    }
  }

  /**
   * Formatea la fecha de venta para mostrar en la tabla
   * @param fechaArray - Array de fecha de la API
   * @returns String formateado
   */
  formatearFecha(fechaArray: number[]): string {
    return formatFechaVenta(fechaArray);
  }
}
