import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaService } from '../../../categoria/services/categoria.service';
import { Categoria, CategoriaRequest } from '../../../categoria/models/categoria.model';

/**
 * Componente modal para crear nuevas categorías
 */
@Component({
  selector: 'app-modal-crear-categoria',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-crear-categoria.component.html',
  styleUrls: ['./modal-crear-categoria.component.css'],
})
export class ModalCrearCategoriaComponent {
  @Input() visible: boolean = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() registroCreado = new EventEmitter<Categoria>();

  private fb = inject(FormBuilder);
  private categoriaService = inject(CategoriaService);

  formulario: FormGroup;
  guardando: boolean = false;
  errorMensaje: string = '';

  constructor() {
    this.formulario = this.fb.group({
      nombreCategoria: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  /**
   * Guarda la nueva categoría
   */
  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.errorMensaje = '';

    const request: CategoriaRequest = {
      nombre_categoria: this.formulario.value.nombreCategoria,
    };

    this.categoriaService.create(request).subscribe({
      next: (categoriaCreada: Categoria) => {
        this.guardando = false;
        this.registroCreado.emit(categoriaCreada);
        this.formulario.reset();
      },
      error: (error: any) => {
        console.error('Error al crear categoría:', error);
        this.errorMensaje = 'Error al crear la categoría. Intente nuevamente.';
        this.guardando = false;
      },
    });
  }

  /**
   * Cierra el modal
   */
  cancelar(): void {
    this.formulario.reset();
    this.errorMensaje = '';
    this.cerrar.emit();
  }

  /**
   * Verifica si un campo es inválido y fue tocado
   */
  esInvalido(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!(control && control.invalid && control.touched);
  }
}
