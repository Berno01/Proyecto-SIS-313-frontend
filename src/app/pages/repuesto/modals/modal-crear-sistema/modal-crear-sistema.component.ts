import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SistemaService } from '../../services/sistema.service';
import { Sistema, SistemaRequest } from '../../models/sistema.model';

/**
 * Componente modal para crear nuevos sistemas
 */
@Component({
  selector: 'app-modal-crear-sistema',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-crear-sistema.component.html',
  styleUrls: ['./modal-crear-sistema.component.css'],
})
export class ModalCrearSistemaComponent {
  @Input() visible: boolean = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() registroCreado = new EventEmitter<Sistema>();

  private fb = inject(FormBuilder);
  private sistemaService = inject(SistemaService);

  formulario: FormGroup;
  guardando: boolean = false;
  errorMensaje: string = '';

  constructor() {
    this.formulario = this.fb.group({
      nombreSistema: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  /**
   * Guarda el nuevo sistema
   */
  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.errorMensaje = '';

    const request: SistemaRequest = {
      nombre_sistema: this.formulario.value.nombreSistema,
    };

    this.sistemaService.create(request).subscribe({
      next: (sistemaCreado: Sistema) => {
        this.guardando = false;
        this.registroCreado.emit(sistemaCreado);
        this.formulario.reset();
      },
      error: (error: any) => {
        console.error('Error al crear sistema:', error);
        this.errorMensaje = 'Error al crear el sistema. Intente nuevamente.';
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
