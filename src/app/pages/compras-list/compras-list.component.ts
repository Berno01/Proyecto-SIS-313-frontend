import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CompraService } from '../compra/services/compra.service';
import { CompraResponse } from '../compra/models/compra.model';
import { formatFechaVenta } from '../venta/utils/date-formatter';

/**
 * Componente para mostrar el historial de compras
 */
@Component({
  selector: 'app-compras-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compras-list.component.html',
  styleUrls: ['./compras-list.component.css'],
})
export class ComprasListComponent implements OnInit {
  compras: CompraResponse[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(private compraService: CompraService, private router: Router) {}

  ngOnInit(): void {
    this.cargarCompras();
  }

  /**
   * Carga todas las compras desde la API
   */
  cargarCompras(): void {
    this.loading = true;
    this.error = '';

    this.compraService.getAllCompras().subscribe({
      next: (data) => {
        this.compras = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar compras:', err);
        this.error = 'Error al cargar las compras. Por favor, intente nuevamente.';
        this.loading = false;
      },
    });
  }

  /**
   * Navega al formulario para crear una nueva compra
   */
  nuevaCompra(): void {
    this.router.navigate(['/compra']);
  }

  /**
   * Navega al formulario para editar una compra existente
   * @param id - ID de la compra a editar
   */
  editarCompra(id: number): void {
    this.router.navigate(['/compra', id]);
  }

  /**
   * Muestra confirmación y elimina una compra
   * @param id - ID de la compra a eliminar
   * @param proveedor - Nombre del proveedor
   */
  eliminarCompra(id: number, proveedor: string): void {
    if (confirm(`¿Está seguro de eliminar la compra del proveedor "${proveedor}"?`)) {
      this.loading = true;

      this.compraService.eliminarCompra(id).subscribe({
        next: (result) => {
          if (result === true) {
            console.log('Compra eliminada:', id);
            // Recargar la lista después de eliminar
            this.cargarCompras();
          } else {
            console.warn('El backend devolvió false al eliminar la compra:', id);
            this.error = 'No se pudo eliminar la compra. Intente nuevamente.';
            this.loading = false;
          }
        },
        error: (err) => {
          console.error('Error al eliminar compra:', err);
          this.error = 'Error al eliminar la compra. Por favor, intente nuevamente.';
          this.loading = false;
        },
      });
    }
  }

  /**
   * Formatea la fecha de compra para mostrar en la tabla
   * @param fechaArray - Array de fecha de la API
   * @returns String formateado
   */
  formatearFecha(fechaArray: number[]): string {
    return formatFechaVenta(fechaArray);
  }

  /**
   * Retorna la clase CSS para el badge de estado
   * @param estado - Estado de la compra
   * @returns Clase CSS
   */
  getEstadoClass(estado: boolean): string {
    return estado ? 'estado-activo' : 'estado-inactivo';
  }

  /**
   * Retorna el texto del estado
   * @param estado - Estado de la compra
   * @returns Texto del estado
   */
  getEstadoTexto(estado: boolean): string {
    return estado ? 'Activo' : 'Inactivo';
  }
}
