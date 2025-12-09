import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RepuestoService } from '../services/repuesto.service';
import { RepuestoResponse } from '../models/repuesto.model';
import { RepuestoBusquedaDTO } from '../models/repuesto-busqueda.model';
import { debounceTime, Subject } from 'rxjs';

/**
 * Componente para listar todos los repuestos con búsqueda inteligente
 */
@Component({
  selector: 'app-repuesto-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './repuesto-list.component.html',
  styleUrl: './repuesto-list.component.css',
})
export class RepuestoListComponent implements OnInit {
  private repuestoService = inject(RepuestoService);
  private router = inject(Router);

  // Estado para búsqueda
  repuestosOriginal: RepuestoBusquedaDTO[] = [];
  repuestosFiltrados: RepuestoBusquedaDTO[] = [];
  terminoBusqueda: string = '';
  private searchSubject = new Subject<string>();

  // Estado para UI
  isLoading: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.configurarBusqueda();
    this.cargarCatalogoBusqueda();
  }

  /**
   * Configura el debounce para la búsqueda
   */
  private configurarBusqueda(): void {
    this.searchSubject.pipe(debounceTime(300)).subscribe((termino) => {
      this.filtrar(termino);
    });
  }

  /**
   * Carga el catálogo de repuestos optimizado para búsqueda
   */
  cargarCatalogoBusqueda(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.repuestoService.obtenerCatalogoBusqueda().subscribe({
      next: (data) => {
        this.repuestosOriginal = data;
        this.repuestosFiltrados = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar catálogo de búsqueda:', error);
        this.errorMessage = 'Error al cargar los repuestos. Por favor, intente nuevamente.';
        this.isLoading = false;
      },
    });
  }

  /**
   * Maneja el evento de búsqueda con debounce
   * @param termino Término de búsqueda ingresado
   */
  onBuscar(termino: string): void {
    this.terminoBusqueda = termino;
    this.searchSubject.next(termino);
  }

  /**
   * Filtra los repuestos según el término de búsqueda
   * @param termino Término de búsqueda
   */
  private filtrar(termino: string): void {
    if (!termino || termino.trim() === '') {
      this.repuestosFiltrados = this.repuestosOriginal;
      return;
    }

    const terminoLower = termino.toLowerCase().trim();
    this.repuestosFiltrados = this.repuestosOriginal.filter((repuesto) =>
      repuesto.search_index.toLowerCase().includes(terminoLower)
    );
  }

  /**
   * Navega al formulario para crear un nuevo repuesto
   */
  nuevoRepuesto(): void {
    this.router.navigate(['/repuestos/nuevo']);
  }

  /**
   * Navega al formulario para editar un repuesto existente
   * @param id ID del repuesto a editar
   */
  editarRepuesto(id: number): void {
    this.router.navigate(['/repuestos/editar', id]);
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
          this.cargarCatalogoBusqueda(); // Recargar la lista
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
   * Obtiene la clase CSS para indicar stock bajo
   * @param stock Stock actual del repuesto
   * @returns Clase CSS
   */
  obtenerClaseStock(stock: number): string {
    return stock < 10 ? 'stock-bajo' : '';
  }
}
