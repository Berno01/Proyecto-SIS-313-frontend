import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RepuestoService } from '../services/repuesto.service';
import { RepuestoResponse } from '../models/repuesto.model';

/**
 * Componente para listar todos los repuestos
 */
@Component({
  selector: 'app-repuesto-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './repuesto-list.component.html',
  styleUrl: './repuesto-list.component.css',
})
export class RepuestoListComponent implements OnInit {
  private repuestoService = inject(RepuestoService);
  private router = inject(Router);

  repuestos: RepuestoResponse[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.cargarRepuestos();
  }

  /**
   * Carga todos los repuestos desde el servidor
   */
  cargarRepuestos(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.repuestoService.getAllRepuestos().subscribe({
      next: (data) => {
        this.repuestos = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar repuestos:', error);
        this.errorMessage = 'Error al cargar los repuestos. Por favor, intente nuevamente.';
        this.isLoading = false;
      },
    });
  }

  /**
   * Navega al formulario para crear un nuevo repuesto
   */
  nuevoRepuesto(): void {
    this.router.navigate(['/repuesto']);
  }

  /**
   * Navega al formulario de edición de un repuesto
   * @param id ID del repuesto a editar
   */
  editarRepuesto(id: number): void {
    this.router.navigate(['/repuesto', id]);
  }

  /**
   * Elimina un repuesto después de confirmar
   * @param id ID del repuesto a eliminar
   * @param nombre Nombre del repuesto (para mostrar en la confirmación)
   */
  eliminarRepuesto(id: number, nombre: string): void {
    if (confirm(`¿Está seguro de eliminar el repuesto "${nombre}"?`)) {
      this.isLoading = true;

      this.repuestoService.eliminarRepuesto(id).subscribe({
        next: (response) => {
          alert('Repuesto eliminado exitosamente');
          this.cargarRepuestos(); // Recargar la lista
        },
        error: (error) => {
          console.error('Error al eliminar repuesto:', error);
          alert('Error al eliminar el repuesto. Por favor, intente nuevamente.');
          this.isLoading = false;
        },
      });
    }
  }

  /**
   * Obtiene los nombres de las categorías como string
   * @param repuesto Repuesto con sus categorías
   * @returns String con nombres de categorías separados por coma
   */
  obtenerNombresCategorias(repuesto: RepuestoResponse): string {
    if (!repuesto.categorias || repuesto.categorias.length === 0) {
      return 'Sin categoría';
    }
    return repuesto.categorias.map((cat) => cat.nombreCategoria).join(', ');
  }

  /**
   * Obtiene la clase CSS para el badge de estado
   * @param estado Estado del repuesto
   * @returns Clase CSS para el badge
   */
  obtenerClaseEstado(estado: boolean): string {
    return estado ? 'badge-active' : 'badge-inactive';
  }

  /**
   * Obtiene el texto del estado
   * @param estado Estado del repuesto
   * @returns Texto del estado
   */
  obtenerTextoEstado(estado: boolean): string {
    return estado ? 'Activo' : 'Inactivo';
  }
}
