import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RepuestoService } from '../services/repuesto.service';
import { CategoriaService } from '../../categoria/services/categoria.service';
import { VehiculoService } from '../services/vehiculo.service';
import { SistemaService } from '../services/sistema.service';
import { Categoria } from '../../categoria/models/categoria.model';
import { Vehiculo } from '../models/vehiculo.model';
import { Sistema } from '../models/sistema.model';
import {
  RepuestoCompleto,
  RepuestoCompletoRequest,
  Compatibilidad,
  CompatibilidadRequest,
} from '../models/repuesto-completo.model';
import { ModalCrearCategoriaComponent } from '../modals/modal-crear-categoria/modal-crear-categoria.component';
import { ModalCrearVehiculoComponent } from '../modals/modal-crear-vehiculo/modal-crear-vehiculo.component';
import { ModalCrearSistemaComponent } from '../modals/modal-crear-sistema/modal-crear-sistema.component';

/**
 * Componente maestro para crear y editar repuestos con compatibilidades
 */
@Component({
  selector: 'app-repuesto-form-completo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalCrearCategoriaComponent,
    ModalCrearVehiculoComponent,
    ModalCrearSistemaComponent,
  ],
  templateUrl: './repuesto-form-completo.component.html',
  styleUrls: ['./repuesto-form-completo.component.css'],
})
export class RepuestoFormCompletoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private repuestoService = inject(RepuestoService);
  private categoriaService = inject(CategoriaService);
  private vehiculoService = inject(VehiculoService);
  private sistemaService = inject(SistemaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Formulario principal
  repuestoForm: FormGroup;

  // Listas para los selects
  listaCategorias: Categoria[] = [];
  listaVehiculos: Vehiculo[] = [];
  listaSistemas: Sistema[] = [];

  // Estados de UI
  modoEdicion: boolean = false;
  isLoading: boolean = false;
  isSaving: boolean = false;
  errorMessage: string = '';

  // Visibilidad de modales
  modalCategoriaVisible: boolean = false;
  modalCategoriasVisible: boolean = false;
  modalVehiculoVisible: boolean = false;
  modalSistemaVisible: boolean = false;

  // Índice de la fila de compatibilidad que abrió el modal de vehículo
  indiceFilaActual: number = -1;

  constructor() {
    this.repuestoForm = this.fb.group({
      idRepuesto: [null],
      nombreRepuesto: ['', [Validators.required, Validators.minLength(3)]],
      stockActual: [0, [Validators.required, Validators.min(0)]],
      costoRepuesto: [0, [Validators.required, Validators.min(0)]],
      precioSugerido: [0, [Validators.required, Validators.min(0)]],
      estadoRepuesto: [true],
      tagsBusqueda: [''],
      idSistema: [null],
      idsCategorias: [[], [Validators.required, Validators.minLength(1)]],
      compatibilidades: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
    this.verificarModoEdicion();
  }

  /**
   * Carga las listas de categorías, vehículos y sistemas
   */
  cargarDatos(): void {
    this.isLoading = true;

    // Cargar categorías
    this.categoriaService.getAll().subscribe({
      next: (categorias) => {
        this.listaCategorias = Array.isArray(categorias) ? categorias : [];
        console.log('Categorías cargadas:', this.listaCategorias);
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.listaCategorias = [];
      },
    });

    // Cargar vehículos
    this.vehiculoService.getAll().subscribe({
      next: (vehiculos) => {
        this.listaVehiculos = Array.isArray(vehiculos) ? vehiculos : [];
        console.log('Vehículos cargados:', this.listaVehiculos);
      },
      error: (error) => {
        console.error('Error al cargar vehículos:', error);
        this.listaVehiculos = [];
      },
    });

    // Cargar sistemas
    this.sistemaService.getAll().subscribe({
      next: (sistemas) => {
        this.listaSistemas = Array.isArray(sistemas) ? sistemas : [];
        console.log('Sistemas cargados:', this.listaSistemas);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar sistemas:', error);
        this.listaSistemas = [];
        this.isLoading = false;
      },
    });
  }

  /**
   * Verifica si está en modo edición
   */
  verificarModoEdicion(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicion = true;
      this.cargarRepuesto(+id);
    }
  }

  /**
   * Carga los datos del repuesto para edición
   * @param id ID del repuesto a editar
   */
  cargarRepuesto(id: number): void {
    this.isLoading = true;
    this.repuestoService.getRepuestoCompletoById(id).subscribe({
      next: (repuesto) => {
        // Limpiar el FormArray de compatibilidades
        while (this.compatibilidades.length !== 0) {
          this.compatibilidades.removeAt(0);
        }

        // Reconstruir el FormArray con las compatibilidades del backend
        if (repuesto.compatibilidades && repuesto.compatibilidades.length > 0) {
          repuesto.compatibilidades.forEach((compatibilidad) => {
            const formGroup = this.fb.group({
              vehiculoId: [compatibilidad.vehiculoId, [Validators.required]],
              anioInicio: [compatibilidad.anioInicio],
              anioFin: [compatibilidad.anioFin],
              notas: [compatibilidad.notas || ''],
            });
            this.compatibilidades.push(formGroup);
          });
        }

        // Cargar los datos del repuesto al formulario
        this.repuestoForm.patchValue({
          idRepuesto: repuesto.idRepuesto,
          nombreRepuesto: repuesto.nombreRepuesto,
          stockActual: repuesto.stockActual,
          costoRepuesto: repuesto.costoRepuesto,
          precioSugerido: repuesto.precioSugerido,
          estadoRepuesto: repuesto.estadoRepuesto,
          tagsBusqueda: repuesto.tagsBusqueda,
          idSistema: repuesto.idSistema,
          idsCategorias: repuesto.idsCategorias,
        });

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar repuesto para edición:', error);
        this.errorMessage = 'Error al cargar el repuesto. Por favor, intente nuevamente.';
        this.isLoading = false;
      },
    });
  }

  /**
   * Getter para el FormArray de compatibilidades
   */
  get compatibilidades(): FormArray {
    return this.repuestoForm.get('compatibilidades') as FormArray;
  }

  /**
   * Crea un FormGroup para una compatibilidad
   */
  crearCompatibilidad(): FormGroup {
    return this.fb.group({
      vehiculoId: [null, [Validators.required]],
      anioInicio: [null],
      anioFin: [null],
      notas: [''],
    });
  }

  /**
   * Agrega una nueva fila de compatibilidad
   */
  agregarCompatibilidad(): void {
    this.compatibilidades.push(this.crearCompatibilidad());
  }

  /**
   * Elimina una fila de compatibilidad
   */
  eliminarCompatibilidad(index: number): void {
    this.compatibilidades.removeAt(index);
  }

  /**
   * Abre el modal de categoría
   */
  abrirModalCategoria(): void {
    this.modalCategoriaVisible = true;
  }

  /**
   * Abre el modal de sistema
   */
  abrirModalSistema(): void {
    this.modalSistemaVisible = true;
  }

  /**
   * Abre el modal de vehículo desde una fila específica de compatibilidad
   */
  abrirModalVehiculo(index: number): void {
    this.indiceFilaActual = index;
    this.modalVehiculoVisible = true;
  }

  /**
   * Maneja la creación de una nueva categoría
   */
  onCategoriaCreada(categoria: Categoria): void {
    console.log('Categoría creada:', categoria);

    // Agregar a la lista (verificar que sea un array)
    if (Array.isArray(this.listaCategorias)) {
      this.listaCategorias.push(categoria);
    }

    // Agregar el ID al array de IDs seleccionados
    const categoriasActuales = this.repuestoForm.get('idsCategorias')?.value || [];
    this.repuestoForm.get('idsCategorias')?.setValue([...categoriasActuales, categoria.id]);

    // Cerrar modal
    this.modalCategoriaVisible = false;
  }

  /**
   * Maneja la creación de un nuevo sistema
   */
  onSistemaCreado(sistema: Sistema): void {
    console.log('Sistema creado:', sistema);

    // Agregar a la lista (verificar que sea un array)
    if (Array.isArray(this.listaSistemas)) {
      this.listaSistemas.push(sistema);
    }

    // Setear automáticamente en el select
    this.repuestoForm.get('idSistema')?.setValue(sistema.id);

    // Cerrar modal
    this.modalSistemaVisible = false;
  }

  /**
   * Maneja la creación de un nuevo vehículo
   */
  onVehiculoCreado(vehiculo: Vehiculo): void {
    console.log('Vehículo creado:', vehiculo);

    // Agregar a la lista (verificar que sea un array)
    if (Array.isArray(this.listaVehiculos)) {
      this.listaVehiculos.push(vehiculo);
    }

    // Setear automáticamente en el select de la fila correspondiente
    if (this.indiceFilaActual >= 0) {
      const compatibilidadControl = this.compatibilidades.at(this.indiceFilaActual);
      compatibilidadControl.get('vehiculoId')?.setValue(vehiculo.id);
    }

    // Cerrar modal y resetear índice
    this.modalVehiculoVisible = false;
    this.indiceFilaActual = -1;
  }

  /**
   * Cierra los modales
   */
  cerrarModales(): void {
    this.modalCategoriaVisible = false;
    this.modalCategoriasVisible = false;
    this.modalVehiculoVisible = false;
    this.modalSistemaVisible = false;
    this.indiceFilaActual = -1;
  }

  /**
   * Abre el modal selector de categorías
   */
  abrirSelectorCategorias(): void {
    this.modalCategoriasVisible = true;
  }

  /**
   * Cierra el modal selector de categorías
   */
  cerrarSelectorCategorias(): void {
    this.modalCategoriasVisible = false;
  }

  /**
   * Verifica si una categoría está seleccionada
   */
  isCategoriaSeleccionada(idCategoria: number): boolean {
    const categoriasSeleccionadas = this.repuestoForm.get('idsCategorias')?.value || [];
    return categoriasSeleccionadas.includes(idCategoria);
  }

  /**
   * Alterna la selección de una categoría
   */
  toggleCategoria(idCategoria: number): void {
    const categoriasSeleccionadas = this.repuestoForm.get('idsCategorias')?.value || [];
    const index = categoriasSeleccionadas.indexOf(idCategoria);

    if (index > -1) {
      // Remover
      categoriasSeleccionadas.splice(index, 1);
    } else {
      // Agregar
      categoriasSeleccionadas.push(idCategoria);
    }

    this.repuestoForm.get('idsCategorias')?.setValue([...categoriasSeleccionadas]);
  }

  /**
   * Remueve una categoría de las seleccionadas
   */
  removerCategoria(idCategoria: number): void {
    const categoriasSeleccionadas = this.repuestoForm.get('idsCategorias')?.value || [];
    const index = categoriasSeleccionadas.indexOf(idCategoria);

    if (index > -1) {
      categoriasSeleccionadas.splice(index, 1);
      this.repuestoForm.get('idsCategorias')?.setValue([...categoriasSeleccionadas]);
    }
  }

  /**
   * Obtiene el nombre de una categoría por su ID
   */
  obtenerNombreCategoria(idCategoria: number): string {
    const categoria = this.listaCategorias.find((c) => c.id === idCategoria);
    return categoria ? categoria.nombre : 'Desconocida';
  }

  /**
   * Guarda el repuesto
   */
  guardarRepuesto(): void {
    if (this.repuestoForm.invalid) {
      this.repuestoForm.markAllAsTouched();
      this.errorMessage = 'Por favor complete todos los campos requeridos';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const repuesto: RepuestoCompleto = this.repuestoForm.value;

    if (this.modoEdicion) {
      // Modo actualización
      this.repuestoService.actualizarRepuestoCompleto(repuesto).subscribe({
        next: (repuestoActualizado) => {
          this.isSaving = false;
          alert('Repuesto actualizado exitosamente');
          this.router.navigate(['/repuestos']);
        },
        error: (error) => {
          console.error('Error al actualizar repuesto:', error);
          this.errorMessage = 'Error al actualizar el repuesto. Por favor, intente nuevamente.';
          this.isSaving = false;
        },
      });
    } else {
      // Modo creación
      this.repuestoService.crearRepuestoCompleto(repuesto).subscribe({
        next: (repuestoCreado) => {
          this.isSaving = false;
          alert('Repuesto creado exitosamente');
          this.router.navigate(['/repuestos']);
        },
        error: (error) => {
          console.error('Error al crear repuesto:', error);
          this.errorMessage = 'Error al crear el repuesto. Por favor, intente nuevamente.';
          this.isSaving = false;
        },
      });
    }
  }

  /**
   * Convierte el objeto a snake_case para el backend
   */
  private convertirASnakeCase(repuesto: RepuestoCompleto): RepuestoCompletoRequest {
    return {
      id_repuesto: repuesto.idRepuesto,
      nombre_repuesto: repuesto.nombreRepuesto,
      stock_actual: repuesto.stockActual,
      costo_repuesto: repuesto.costoRepuesto,
      precio_sugerido: repuesto.precioSugerido,
      estado_repuesto: repuesto.estadoRepuesto,
      tags_busqueda: repuesto.tagsBusqueda,
      id_sistema: repuesto.idSistema,
      ids_categorias: repuesto.idsCategorias,
      compatibilidades: repuesto.compatibilidades.map((c) => ({
        vehiculo_id: c.vehiculoId,
        anio_inicio: c.anioInicio,
        anio_fin: c.anioFin,
        notas: c.notas,
      })),
    };
  }

  /**
   * Cancela y vuelve a la lista
   */
  cancelar(): void {
    if (confirm('¿Está seguro de cancelar? Los cambios no guardados se perderán.')) {
      this.router.navigate(['/repuestos']);
    }
  }

  /**
   * Verifica si un campo es inválido y fue tocado
   */
  esInvalido(campo: string): boolean {
    const control = this.repuestoForm.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  /**
   * Verifica si un campo de compatibilidad es inválido y fue tocado
   */
  esInvalidoCompatibilidad(index: number, campo: string): boolean {
    const control = this.compatibilidades.at(index).get(campo);
    return !!(control && control.invalid && control.touched);
  }
}
