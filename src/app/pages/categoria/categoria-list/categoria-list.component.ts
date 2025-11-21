import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoriaService } from '../services/categoria.service';
import { Categoria } from '../models/categoria.model';

/**
 * Componente para listar todas las categorías
 */
@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categoria-list.component.html',
  styleUrl: './categoria-list.component.css',
})
export class CategoriaListComponent implements OnInit {
  private categoriaService = inject(CategoriaService);
  private router = inject(Router);

  categorias: Categoria[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.cargarCategorias();
  }

  /**
   * Carga todas las categorías desde el servidor
   */
  cargarCategorias(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.categoriaService.getAllCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.errorMessage = 'Error al cargar las categorías. Por favor, intente nuevamente.';
        this.isLoading = false;
      },
    });
  }

  /**
   * Navega al formulario para crear una nueva categoría
   */
  nuevaCategoria(): void {
    this.router.navigate(['/categoria']);
  }

  /**
   * Navega al formulario de edición de una categoría
   * @param id ID de la categoría a editar
   */
  editarCategoria(id: number): void {
    this.router.navigate(['/categoria', id]);
  }

  /**
   * Elimina una categoría después de confirmar
   * @param id ID de la categoría a eliminar
   * @param nombre Nombre de la categoría (para mostrar en la confirmación)
   */
  eliminarCategoria(id: number, nombre: string): void {
    if (confirm(`¿Está seguro de eliminar la categoría "${nombre}"?`)) {
      this.isLoading = true;

      this.categoriaService.eliminarCategoria(id).subscribe({
        next: (response) => {
          alert('Categoría eliminada exitosamente');
          this.cargarCategorias(); // Recargar la lista
        },
        error: (error) => {
          console.error('Error al eliminar categoría:', error);
          alert('Error al eliminar la categoría. Por favor, intente nuevamente.');
          this.isLoading = false;
        },
      });
    }
  }
}
