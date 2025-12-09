import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RepuestoService } from '../../services/repuesto.service';
import { Repuesto } from '../../models/repuesto.model';
import { DetalleVenta } from '../../models/detalle-venta.model';

/**
 * Componente Modal para seleccionar y agregar repuestos a la venta
 */
@Component({
  selector: 'app-modal-repuestos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './modal-repuestos.component.html',
  styleUrls: ['./modal-repuestos.component.css'],
})
export class ModalRepuestosComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() repuestoAgregado = new EventEmitter<{ repuesto: Repuesto; detalle: DetalleVenta }>();

  repuestos: Repuesto[] = [];
  repuestosFiltrados: Repuesto[] = [];
  repuestoSeleccionado: Repuesto | null = null;
  searchTerm: string = '';
  loading: boolean = false;
  error: string = '';

  detalleForm!: FormGroup;

  constructor(private repuestoService: RepuestoService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarRepuestos();
  }

  /**
   * Inicializa el formulario de detalle
   */
  private initForm(): void {
    this.detalleForm = this.fb.group({
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precio_unitario: [0, [Validators.required, Validators.min(0.01)]],
    });
  }

  /**
   * Carga la lista de repuestos desde la API
   */
  private cargarRepuestos(): void {
    this.loading = true;
    this.error = '';

    this.repuestoService.getRepuestos().subscribe({
      next: (data) => {
        this.repuestos = data;
        this.repuestosFiltrados = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar repuestos:', err);
        this.error = 'Error al cargar los repuestos. Por favor, intente nuevamente.';
        this.loading = false;
      },
    });
  }

  /**
   * Filtra los repuestos según el término de búsqueda
   */
  filtrarRepuestos(): void {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.repuestosFiltrados = this.repuestos;
    } else {
      this.repuestosFiltrados = this.repuestos.filter((r) =>
        r.nombreRepuesto.toLowerCase().includes(term)
      );
    }
  }

  /**
   * Selecciona un repuesto y carga sus detalles
   */
  seleccionarRepuesto(repuesto: Repuesto): void {
    this.loading = true;
    this.error = '';

    this.repuestoService.getRepuestoById(repuesto.idRepuesto).subscribe({
      next: (data) => {
        this.repuestoSeleccionado = data;

        // Pre-llenar el precio unitario con el precio sugerido
        this.detalleForm.patchValue({
          cantidad: 1,
          precio_unitario: data.precioSugerido,
        });

        // Actualizar validador de cantidad máxima
        this.detalleForm
          .get('cantidad')
          ?.setValidators([
            Validators.required,
            Validators.min(1),
            Validators.max(data.stockRepuesto),
          ]);
        this.detalleForm.get('cantidad')?.updateValueAndValidity();

        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar detalle del repuesto:', err);
        this.error = 'Error al cargar el detalle del repuesto.';
        this.loading = false;
      },
    });
  }

  /**
   * Calcula el subtotal basado en cantidad y precio unitario
   */
  get subtotal(): number {
    const cantidad = this.detalleForm.get('cantidad')?.value || 0;
    const precio = this.detalleForm.get('precio_unitario')?.value || 0;
    return cantidad * precio;
  }

  /**
   * Valida y agrega el repuesto al detalle de venta
   */
  agregarRepuesto(): void {
    if (!this.repuestoSeleccionado) {
      this.error = 'Debe seleccionar un repuesto.';
      return;
    }

    if (this.detalleForm.invalid) {
      this.error = 'Por favor, complete todos los campos correctamente.';
      this.detalleForm.markAllAsTouched();
      return;
    }

    const cantidad = this.detalleForm.get('cantidad')?.value;
    const precioUnitario = this.detalleForm.get('precio_unitario')?.value;

    // Validar stock
    if (cantidad > this.repuestoSeleccionado.stockRepuesto) {
      this.error = `La cantidad no puede exceder el stock disponible (${this.repuestoSeleccionado.stockRepuesto}).`;
      return;
    }

    // Crear detalle de venta
    const detalle: DetalleVenta = {
      id_repuesto: this.repuestoSeleccionado.idRepuesto,
      cantidad: cantidad,
      precio_sugerido_repuesto: this.repuestoSeleccionado.precioSugerido,
      precio_unitario_repuesto: precioUnitario,
      total: cantidad * precioUnitario,
      costo_repuesto: this.repuestoSeleccionado.costoRepuesto,
    };

    // Emitir evento con el repuesto y el detalle
    this.repuestoAgregado.emit({
      repuesto: this.repuestoSeleccionado,
      detalle: detalle,
    });

    // Cerrar modal
    this.cerrarModal();
  }

  /**
   * Cierra el modal
   */
  cerrarModal(): void {
    this.close.emit();
  }

  /**
   * Vuelve a la lista de repuestos
   */
  volverALista(): void {
    this.repuestoSeleccionado = null;
    this.detalleForm.reset({
      cantidad: 1,
      precio_unitario: 0,
    });
    this.error = '';
  }
}
