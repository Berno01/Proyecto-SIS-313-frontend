import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompraService } from './services/compra.service';
import { RepuestoService } from '../venta/services/repuesto.service';
import { CompraRequest, CompraResponse } from './models/compra.model';
import { DetalleCompra } from './models/detalle-compra.model';
import { Repuesto } from '../venta/models/repuesto.model';
import { ModalRepuestosCompraComponent } from './components/modal-repuestos-compra/modal-repuestos-compra.component';
import { DetalleCompraItemComponent } from './components/detalle-compra-item/detalle-compra-item.component';
import { forkJoin } from 'rxjs';

/**
 * Componente principal para gestionar Compras
 */
@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    ModalRepuestosCompraComponent,
    DetalleCompraItemComponent,
  ],
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css'],
})
export class CompraComponent implements OnInit {
  compraForm!: FormGroup;
  detalleCompra: DetalleCompra[] = [];
  repuestosMap: Map<number, Repuesto> = new Map();

  mostrarModal: boolean = false;
  loading: boolean = false;
  error: string = '';
  successMessage: string = '';

  // Variables para modo edición
  compraId: number | null = null;
  modoEdicion: boolean = false;

  constructor(
    private fb: FormBuilder,
    private compraService: CompraService,
    private repuestoService: RepuestoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Detectar si hay un ID en la ruta
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.compraId = +id;
        this.modoEdicion = true;
        this.cargarCompraParaEditar(this.compraId);
      }
    });
  }

  /**
   * Inicializa el formulario de compra
   */
  private initForm(): void {
    this.compraForm = this.fb.group({
      nombre_proveedor: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  /**
   * Carga una compra existente para editar
   * @param id - ID de la compra a cargar
   */
  private cargarCompraParaEditar(id: number): void {
    this.loading = true;
    this.error = '';

    this.compraService.getCompraById(id).subscribe({
      next: (compraResponse) => {
        if (!compraResponse) {
          this.error = 'Compra no encontrada';
          this.loading = false;
          return;
        }

        // Mapear datos al formulario
        this.compraForm.patchValue({
          nombre_proveedor: compraResponse.nombreProveedor,
        });

        // Cargar detalles y obtener información de los repuestos
        this.cargarDetallesCompra(compraResponse);
      },
      error: (err) => {
        console.error('Error al cargar compra:', err);
        this.error = 'Error al cargar la compra. Por favor, intente nuevamente.';
        this.loading = false;
      },
    });
  }

  /**
   * Carga los detalles de compra y obtiene información de repuestos
   * @param compraResponse - Respuesta de la API con la compra
   */
  private cargarDetallesCompra(compraResponse: CompraResponse): void {
    // Crear array de observables para obtener cada repuesto
    const repuestosObservables = compraResponse.detalleCompra.map((detalle) =>
      this.repuestoService.getRepuestoById(detalle.idRepuesto)
    );

    // Ejecutar todas las peticiones en paralelo
    forkJoin(repuestosObservables).subscribe({
      next: (repuestos) => {
        // Mapear detalles de compra
        this.detalleCompra = compraResponse.detalleCompra.map((detalle) => ({
          id_repuesto: detalle.idRepuesto,
          cantidad: detalle.cantidad,
          costo_repuesto: detalle.costoRepuesto,
          total: detalle.total,
        }));

        // Llenar el map de repuestos
        repuestos.forEach((repuesto) => {
          this.repuestosMap.set(repuesto.idRepuesto, repuesto);
        });

        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar repuestos:', err);
        this.error = 'Error al cargar los detalles de los repuestos.';
        this.loading = false;
      },
    });
  }

  /**
   * Abre el modal de repuestos
   */
  abrirModalRepuestos(): void {
    this.mostrarModal = true;
    this.error = '';
  }

  /**
   * Cierra el modal de repuestos
   */
  cerrarModal(): void {
    this.mostrarModal = false;
  }

  /**
   * Agrega un repuesto al detalle de compra
   */
  agregarRepuestoAlDetalle(event: { repuesto: Repuesto; detalle: DetalleCompra }): void {
    const { repuesto, detalle } = event;

    // Verificar si el repuesto ya está en el detalle
    const existeIndex = this.detalleCompra.findIndex((d) => d.id_repuesto === detalle.id_repuesto);

    if (existeIndex >= 0) {
      // Si existe, sumar la cantidad
      this.detalleCompra[existeIndex].cantidad += detalle.cantidad;
      this.detalleCompra[existeIndex].total =
        this.detalleCompra[existeIndex].cantidad * this.detalleCompra[existeIndex].costo_repuesto;
    } else {
      // Si no existe, agregar al detalle
      this.detalleCompra.push(detalle);
      this.repuestosMap.set(repuesto.idRepuesto, repuesto);
    }

    this.cerrarModal();
  }

  /**
   * Elimina un item del detalle de compra
   */
  eliminarItem(index: number): void {
    const idRepuesto = this.detalleCompra[index].id_repuesto;
    this.detalleCompra.splice(index, 1);

    // Limpiar del map si no hay más items de ese repuesto
    const existe = this.detalleCompra.some((d) => d.id_repuesto === idRepuesto);
    if (!existe) {
      this.repuestosMap.delete(idRepuesto);
    }
  }

  /**
   * Recalcula los totales cuando cambia un detalle
   */
  onDetalleChange(): void {
    // Este método se llama cuando cambian costos o cantidades
    // Los totales se recalculan automáticamente en los getters
  }

  /**
   * Obtiene el repuesto del map por ID
   */
  getRepuesto(idRepuesto: number): Repuesto {
    return this.repuestosMap.get(idRepuesto)!;
  }

  /**
   * Calcula el total de la compra (suma de todos los totales del detalle)
   */
  get totalCompra(): number {
    return this.detalleCompra.reduce((sum, item) => sum + item.total, 0);
  }

  /**
   * Valida y guarda la compra
   */
  guardarCompra(): void {
    // Limpiar mensajes
    this.error = '';
    this.successMessage = '';

    // Validar formulario
    if (this.compraForm.invalid) {
      this.error = 'Por favor, complete todos los campos requeridos.';
      this.compraForm.markAllAsTouched();
      return;
    }

    // Validar que haya al menos un repuesto
    if (this.detalleCompra.length === 0) {
      this.error = 'Debe agregar al menos un repuesto a la compra.';
      return;
    }

    // Validar que el total sea positivo
    if (this.totalCompra <= 0) {
      this.error = 'El total de la compra debe ser mayor a 0.';
      return;
    }

    // Construir objeto compra
    const compra: CompraRequest = {
      id_compra: this.compraId, // Usar el ID si estamos en modo edición
      nombre_proveedor: this.compraForm.get('nombre_proveedor')?.value,
      total_compra: this.totalCompra,
      detalle_compra: this.detalleCompra.map((d) => ({
        id_repuesto: d.id_repuesto,
        cantidad: d.cantidad,
        total: d.total,
        costo_repuesto: d.costo_repuesto,
      })),
    };

    // Enviar al servidor
    this.loading = true;

    if (this.modoEdicion && this.compraId) {
      // Modo edición: llamar al endpoint de update
      this.compraService.actualizarCompra(compra).subscribe({
        next: (response) => {
          console.log('Compra actualizada exitosamente:', response);
          this.successMessage = 'Compra actualizada exitosamente.';
          this.loading = false;
          // Redirigir al historial después de unos segundos
          setTimeout(() => {
            this.router.navigate(['/compras']);
          }, 1500);
        },
        error: (err) => {
          console.error('Error al actualizar compra:', err);
          this.error =
            err.error?.message || 'Error al actualizar la compra. Por favor, intente nuevamente.';
          this.loading = false;
        },
      });
    } else {
      // Crear nueva compra
      this.compraService.crearCompra(compra).subscribe({
        next: (response) => {
          console.log('Compra guardada exitosamente:', response);
          this.successMessage = 'Compra guardada exitosamente.';
          this.loading = false;
          // Redirigir al historial después de unos segundos
          setTimeout(() => {
            this.router.navigate(['/compras']);
          }, 1500);
        },
        error: (err) => {
          console.error('Error al guardar compra:', err);
          this.error =
            err.error?.message || 'Error al guardar la compra. Por favor, intente nuevamente.';
          this.loading = false;
        },
      });
    }
  }

  /**
   * Cancela y vuelve al historial
   */
  cancelar(): void {
    if (confirm('¿Está seguro que desea cancelar? Se perderán todos los cambios no guardados.')) {
      this.router.navigate(['/compras']);
    }
  }

  /**
   * Vuelve al historial de compras
   */
  volverAlHistorial(): void {
    this.router.navigate(['/compras']);
  }
}
