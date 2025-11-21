import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RepuestoService } from '../../../venta/services/repuesto.service';
import { Repuesto } from '../../../venta/models/repuesto.model';
import { DetalleCompra } from '../../models/detalle-compra.model';

/**
 * Componente Modal para seleccionar y agregar repuestos a la compra
 */
@Component({
  selector: 'app-modal-repuestos-compra',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './modal-repuestos-compra.component.html',
  styleUrls: ['./modal-repuestos-compra.component.css'],
})
export class ModalRepuestosCompraComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() repuestoAgregado = new EventEmitter<{ repuesto: Repuesto; detalle: DetalleCompra }>();

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
      costo_repuesto: [0, [Validators.required, Validators.min(0.01)]],
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

        // Pre-llenar el costo del repuesto
        this.detalleForm.patchValue({
          cantidad: 1,
          costo_repuesto: data.costoRepuesto,
        });

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
   * Calcula el subtotal basado en cantidad y costo
   */
  get subtotal(): number {
    const cantidad = this.detalleForm.get('cantidad')?.value || 0;
    const costo = this.detalleForm.get('costo_repuesto')?.value || 0;
    return cantidad * costo;
  }

  /**
   * Valida y agrega el repuesto al detalle de compra
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
    const costoRepuesto = this.detalleForm.get('costo_repuesto')?.value;

    // Validar cantidad mayor a 0
    if (cantidad <= 0) {
      this.error = 'La cantidad debe ser mayor a 0.';
      return;
    }

    // Validar costo mayor a 0
    if (costoRepuesto <= 0) {
      this.error = 'El costo debe ser mayor a 0.';
      return;
    }

    // Crear detalle de compra
    const detalle: DetalleCompra = {
      id_repuesto: this.repuestoSeleccionado.idRepuesto,
      cantidad: cantidad,
      costo_repuesto: costoRepuesto,
      total: cantidad * costoRepuesto,
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
      costo_repuesto: 0,
    });
    this.error = '';
  }
}
