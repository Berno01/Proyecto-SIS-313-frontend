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
import { VentaService } from './services/venta.service';
import { RepuestoService } from './services/repuesto.service';
import { Venta } from './models/venta.model';
import { DetalleVenta } from './models/detalle-venta.model';
import { Repuesto } from './models/repuesto.model';
import { VentaResponse } from './models/venta-response.model';
import { ModalRepuestosComponent } from './components/modal-repuestos/modal-repuestos.component';
import { DetalleVentaItemComponent } from './components/detalle-venta-item/detalle-venta-item.component';
import { forkJoin } from 'rxjs';

/**
 * Componente principal para gestionar Ventas
 */
@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    ModalRepuestosComponent,
    DetalleVentaItemComponent,
  ],
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css'],
})
export class VentaComponent implements OnInit {
  ventaForm!: FormGroup;
  detalleVenta: DetalleVenta[] = [];
  repuestosMap: Map<number, Repuesto> = new Map();

  mostrarModal: boolean = false;
  loading: boolean = false;
  error: string = '';
  successMessage: string = '';

  // Variables para modo edición
  ventaId: number | null = null;
  modoEdicion: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ventaService: VentaService,
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
        this.ventaId = +id;
        this.modoEdicion = true;
        this.cargarVentaParaEditar(this.ventaId);
      }
    });
  }

  /**
   * Inicializa el formulario de venta
   */
  private initForm(): void {
    this.ventaForm = this.fb.group({
      nombre_cliente: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  /**
   * Carga una venta existente para editar
   * @param id - ID de la venta a cargar
   */
  private cargarVentaParaEditar(id: number): void {
    this.loading = true;
    this.error = '';

    this.ventaService.getVentaById(id).subscribe({
      next: (ventaResponse) => {
        if (!ventaResponse) {
          this.error = 'Venta no encontrada';
          this.loading = false;
          return;
        }

        // Mapear datos al formulario (no manejamos descuento en el formulario)
        this.ventaForm.patchValue({
          nombre_cliente: ventaResponse.nombreCliente,
        });

        // Cargar detalles y obtener información de los repuestos
        this.cargarDetallesVenta(ventaResponse);
      },
      error: (err) => {
        console.error('Error al cargar venta:', err);
        this.error = 'Error al cargar la venta. Por favor, intente nuevamente.';
        this.loading = false;
      },
    });
  }

  /**
   * Carga los detalles de venta y obtiene información de repuestos
   * @param ventaResponse - Respuesta de la API con la venta
   */
  private cargarDetallesVenta(ventaResponse: VentaResponse): void {
    // Crear array de observables para obtener cada repuesto
    const repuestosObservables = ventaResponse.detalleVenta.map((detalle) =>
      this.repuestoService.getRepuestoById(detalle.idRepuesto)
    );

    // Ejecutar todas las peticiones en paralelo
    forkJoin(repuestosObservables).subscribe({
      next: (repuestos) => {
        // Mapear detalles de venta
        this.detalleVenta = ventaResponse.detalleVenta.map((detalle) => ({
          id_repuesto: detalle.idRepuesto,
          cantidad: detalle.cantidad,
          precio_sugerido_repuesto: detalle.precioSugeridoRepuesto,
          precio_unitario_repuesto: detalle.precioUnitarioRepuesto,
          total: detalle.total,
          costo_repuesto: detalle.costoRepuesto,
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
   * Agrega un repuesto al detalle de venta
   */
  agregarRepuestoAlDetalle(event: { repuesto: Repuesto; detalle: DetalleVenta }): void {
    const { repuesto, detalle } = event;

    // Verificar si el repuesto ya está en el detalle
    const existeIndex = this.detalleVenta.findIndex((d) => d.id_repuesto === detalle.id_repuesto);

    if (existeIndex >= 0) {
      // Si existe, sumar la cantidad (validar stock)
      const cantidadTotal = this.detalleVenta[existeIndex].cantidad + detalle.cantidad;

      if (cantidadTotal > repuesto.stockRepuesto) {
        this.error = `No hay suficiente stock. Stock disponible: ${repuesto.stockRepuesto}`;
        return;
      }

      this.detalleVenta[existeIndex].cantidad = cantidadTotal;
      this.detalleVenta[existeIndex].total =
        cantidadTotal * this.detalleVenta[existeIndex].precio_unitario_repuesto;
    } else {
      // Si no existe, agregar al detalle
      this.detalleVenta.push(detalle);
      this.repuestosMap.set(repuesto.idRepuesto, repuesto);
    }

    this.cerrarModal();
  }

  /**
   * Elimina un item del detalle de venta
   */
  eliminarItem(index: number): void {
    const idRepuesto = this.detalleVenta[index].id_repuesto;
    this.detalleVenta.splice(index, 1);

    // Limpiar del map si no hay más items de ese repuesto
    const existe = this.detalleVenta.some((d) => d.id_repuesto === idRepuesto);
    if (!existe) {
      this.repuestosMap.delete(idRepuesto);
    }
  }

  /**
   * Recalcula los totales cuando cambia un detalle
   */
  onDetalleChange(): void {
    // Este método se llama cuando cambian precios o cantidades
    // Los totales se recalculan automáticamente en los getters
  }

  /**
   * Obtiene el repuesto del map por ID
   */
  getRepuesto(idRepuesto: number): Repuesto {
    return this.repuestosMap.get(idRepuesto)!;
  }

  /**
   * Calcula el subtotal de todos los items
   */
  get subtotal(): number {
    return this.detalleVenta.reduce((sum, item) => sum + item.total, 0);
  }

  /**
   * Calcula el total de la venta (subtotal). El descuento se calcula en el backend.
   */
  get totalVenta(): number {
    return this.subtotal;
  }

  /**
   * Valida y guarda la venta
   */
  guardarVenta(): void {
    // Limpiar mensajes
    this.error = '';
    this.successMessage = '';

    // Validar formulario
    if (this.ventaForm.invalid) {
      this.error = 'Por favor, complete todos los campos requeridos.';
      this.ventaForm.markAllAsTouched();
      return;
    }

    // Validar que haya al menos un repuesto
    if (this.detalleVenta.length === 0) {
      this.error = 'Debe agregar al menos un repuesto a la venta.';
      return;
    }

    // Validar que el total sea positivo
    if (this.totalVenta <= 0) {
      this.error = 'El total de la venta debe ser mayor a 0.';
      return;
    }

    // Construir objeto venta (no enviar descuento_total desde UI)
    const venta: Venta = {
      id_venta: this.ventaId, // Usar el ID si estamos en modo edición
      nombre_cliente: this.ventaForm.get('nombre_cliente')?.value,
      total_venta: this.totalVenta,
      detalle_venta: this.detalleVenta,
    };

    // Enviar al servidor
    this.loading = true;

    if (this.modoEdicion && this.ventaId) {
      // Modo edición: llamar al endpoint de update
      this.ventaService.updateVenta(venta).subscribe({
        next: (response) => {
          console.log('Venta actualizada exitosamente:', response);
          this.successMessage = 'Venta actualizada exitosamente.';
          this.loading = false;
          // Redirigir al historial después de unos segundos
          setTimeout(() => {
            this.router.navigate(['/ventas']);
          }, 1500);
        },
        error: (err) => {
          console.error('Error al actualizar venta:', err);
          this.error =
            err.error?.message || 'Error al actualizar la venta. Por favor, intente nuevamente.';
          this.loading = false;
        },
      });
    } else {
      // Crear nueva venta
      this.ventaService.guardarVenta(venta).subscribe({
        next: (response) => {
          console.log('Venta guardada exitosamente:', response);
          this.successMessage = 'Venta guardada exitosamente.';
          this.loading = false;
          // Redirigir al historial después de unos segundos
          setTimeout(() => {
            this.router.navigate(['/ventas']);
          }, 1500);
        },
        error: (err) => {
          console.error('Error al guardar venta:', err);
          this.error =
            err.error?.message || 'Error al guardar la venta. Por favor, intente nuevamente.';
          this.loading = false;
        },
      });
    }
  }

  /**
   * Resetea el formulario y el detalle
   */
  private resetearFormulario(): void {
    this.ventaForm.reset({
      nombre_cliente: '',
    });
    this.detalleVenta = [];
    this.repuestosMap.clear();
    this.ventaId = null;
    this.modoEdicion = false;
  }

  /**
   * Cancela y vuelve al historial
   */
  cancelar(): void {
    if (confirm('¿Está seguro que desea cancelar? Se perderán todos los cambios no guardados.')) {
      this.router.navigate(['/ventas']);
    }
  }

  /**
   * Vuelve al historial de ventas
   */
  volverAlHistorial(): void {
    this.router.navigate(['/ventas']);
  }
}
