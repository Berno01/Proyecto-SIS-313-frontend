import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehiculoService } from '../../services/vehiculo.service';
import { Vehiculo, VehiculoRequest } from '../../models/vehiculo.model';

/**
 * Componente modal para crear nuevos vehículos
 */
@Component({
  selector: 'app-modal-crear-vehiculo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-crear-vehiculo.component.html',
  styleUrls: ['./modal-crear-vehiculo.component.css'],
})
export class ModalCrearVehiculoComponent {
  @Input() visible: boolean = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() registroCreado = new EventEmitter<Vehiculo>();

  private fb = inject(FormBuilder);
  private vehiculoService = inject(VehiculoService);

  formulario: FormGroup;
  guardando: boolean = false;
  errorMensaje: string = '';

  constructor() {
    this.formulario = this.fb.group({
      marca: ['', [Validators.required, Validators.minLength(2)]],
      modelo: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  /**
   * Guarda el nuevo vehículo
   */
  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.errorMensaje = '';

    const request: VehiculoRequest = {
      marca: this.formulario.value.marca,
      modelo: this.formulario.value.modelo,
    };

    this.vehiculoService.create(request).subscribe({
      next: (vehiculoCreado: Vehiculo) => {
        this.guardando = false;
        this.registroCreado.emit(vehiculoCreado);
        this.formulario.reset();
      },
      error: (error: any) => {
        console.error('Error al crear vehículo:', error);
        this.errorMensaje = 'Error al crear el vehículo. Intente nuevamente.';
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
