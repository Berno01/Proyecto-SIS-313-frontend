import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoriaService } from '../services/categoria.service';
import { Categoria } from '../models/categoria.model';

/**
 * Componente para crear y editar categorías
 */
@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categoria-form.component.html',
  styleUrl: './categoria-form.component.css',
})
export class CategoriaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoriaService = inject(CategoriaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  categoriaForm: FormGroup;
  modoEdicion: boolean = false;
  isLoading: boolean = false;
  isSaving: boolean = false;
  errorMessage: string = '';

  constructor() {
    // Inicializar el formulario
    this.categoriaForm = this.fb.group({
      idCategoria: [null],
      nombreCategoria: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    // Detectar si es edición o creación
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.modoEdicion = true;
      this.cargarCategoria(Number(id));
    } else {
      this.modoEdicion = false;
      this.inicializarFormularioVacio();
    }
  }

  /**
   * Inicializa el formulario vacío para crear nueva categoría
   */
  inicializarFormularioVacio(): void {
    this.categoriaForm.reset({
      idCategoria: null,
      nombreCategoria: '',
    });
  }

  /**
   * Carga los datos de una categoría existente para editar
   * @param id ID de la categoría a cargar
   */
  cargarCategoria(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.categoriaService.getCategoriaById(id).subscribe({
      next: (categoria) => {
        this.categoriaForm.patchValue({
          idCategoria: categoria.id,
          nombreCategoria: categoria.nombre,
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar categoría:', error);
        this.errorMessage = 'No se pudo cargar la categoría';
        alert('No se pudo cargar la categoría. Será redirigido a la lista.');
        this.router.navigate(['/categorias']);
      },
    });
  }

  /**
   * Guarda la categoría (crear o actualizar según el modo)
   */
  guardarCategoria(): void {
    // Validar el formulario
    if (this.categoriaForm.invalid) {
      this.marcarCamposComoTocados();
      return;
    }

    this.isSaving = true;
    const formValue = this.categoriaForm.value;

    if (this.modoEdicion) {
      // Actualizar categoría existente
      const categoria: Categoria = {
        id: formValue.idCategoria,
        nombre: formValue.nombreCategoria,
      };
      this.categoriaService.actualizarCategoria(categoria).subscribe({
        next: (response) => {
          alert('Categoría actualizada exitosamente');
          this.router.navigate(['/categorias']);
        },
        error: (error) => {
          console.error('Error al actualizar categoría:', error);
          alert('Error al actualizar la categoría. Por favor, intente nuevamente.');
          this.isSaving = false;
        },
      });
    } else {
      // Crear nueva categoría
      const request: any = {
        nombre_categoria: formValue.nombreCategoria
      };
      this.categoriaService.crearCategoria(request).subscribe({
        next: (response) => {
          alert('Categoría creada exitosamente');
          this.router.navigate(['/categorias']);
        },
        error: (error) => {
          console.error('Error al crear categoría:', error);
          alert('Error al crear la categoría. Por favor, intente nuevamente.');
          this.isSaving = false;
        },
      });
    }
  }

  /**
   * Marca todos los campos del formulario como tocados para mostrar errores
   */
  marcarCamposComoTocados(): void {
    Object.keys(this.categoriaForm.controls).forEach((key) => {
      this.categoriaForm.get(key)?.markAsTouched();
    });
  }

  /**
   * Cancela la operación y vuelve a la lista
   */
  cancelar(): void {
    if (confirm('¿Está seguro de cancelar? Los cambios no guardados se perderán.')) {
      this.router.navigate(['/categorias']);
    }
  }

  /**
   * Verifica si un campo tiene errores y ha sido tocado
   * @param campo Nombre del campo a verificar
   * @returns true si el campo tiene errores y ha sido tocado
   */
  mostrarError(campo: string): boolean {
    const control = this.categoriaForm.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   * @param campo Nombre del campo
   * @returns Mensaje de error
   */
  obtenerMensajeError(campo: string): string {
    const control = this.categoriaForm.get(campo);

    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }

    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Debe tener al menos ${minLength} caracteres`;
    }

    return '';
  }
}
