import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RepuestoService } from '../services/repuesto.service';
import { CategoriaService } from '../../categoria/services/categoria.service';
import { Repuesto, RepuestoResponse } from '../models/repuesto.model';
import { Categoria } from '../../categoria/models/categoria.model';

/**
 * Componente para crear y editar repuestos
 */
@Component({
  selector: 'app-repuesto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './repuesto-form.component.html',
  styleUrl: './repuesto-form.component.css',
})
export class RepuestoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private repuestoService = inject(RepuestoService);
  private categoriaService = inject(CategoriaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  repuestoForm: FormGroup;
  listaCategorias: Categoria[] = [];
  modoEdicion: boolean = false;
  isLoading: boolean = false;
  isSaving: boolean = false;
  isLoadingCategorias: boolean = false;
  errorMessage: string = '';

  constructor() {
    // Inicializar el formulario
    this.repuestoForm = this.fb.group({
      idRepuesto: [null],
      nombreRepuesto: ['', [Validators.required, Validators.minLength(3)]],
      stockActual: [0, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+$')]],
      costoRepuesto: [0, [Validators.required, Validators.min(0)]],
      precioSugerido: [0, [Validators.required, Validators.min(0)]],
      estadoRepuesto: [true, [Validators.required]],
      idsCategorias: [[], [Validators.required, Validators.minLength(1)]],
    });
  }

  ngOnInit(): void {
    this.cargarCategorias();

    // Detectar si es edición o creación
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.modoEdicion = true;
      this.cargarRepuesto(Number(id));
    } else {
      this.modoEdicion = false;
      this.inicializarFormularioVacio();
    }
  }

  /**
   * Carga todas las categorías disponibles
   */
  cargarCategorias(): void {
    this.isLoadingCategorias = true;

    this.categoriaService.getAllCategorias().subscribe({
      next: (categorias) => {
        this.listaCategorias = categorias;
        this.isLoadingCategorias = false;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        alert('Error al cargar las categorías. Por favor, recargue la página.');
        this.isLoadingCategorias = false;
      },
    });
  }

  /**
   * Inicializa el formulario vacío para crear nuevo repuesto
   */
  inicializarFormularioVacio(): void {
    this.repuestoForm.reset({
      idRepuesto: null,
      nombreRepuesto: '',
      stockActual: 0,
      costoRepuesto: 0,
      precioSugerido: 0,
      estadoRepuesto: true,
      idsCategorias: [],
    });
  }

  /**
   * Carga los datos de un repuesto existente para editar
   * @param id ID del repuesto a cargar
   */
  cargarRepuesto(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.repuestoService.getRepuestoById(id).subscribe({
      next: (repuesto) => {
        // Extraer los IDs de las categorías
        const idsCategorias = repuesto.categorias
          ? repuesto.categorias.map((cat) => cat.idCategoria)
          : repuesto.idsCategorias || [];

        this.repuestoForm.patchValue({
          idRepuesto: repuesto.idRepuesto,
          nombreRepuesto: repuesto.nombreRepuesto,
          stockActual: repuesto.stockActual,
          costoRepuesto: repuesto.costoRepuesto,
          precioSugerido: repuesto.precioSugerido,
          estadoRepuesto: repuesto.estadoRepuesto,
          idsCategorias: idsCategorias,
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar repuesto:', error);
        this.errorMessage = 'No se pudo cargar el repuesto';
        alert('No se pudo cargar el repuesto. Será redirigido a la lista.');
        this.router.navigate(['/repuestos']);
      },
    });
  }

  /**
   * Maneja el cambio en los checkboxes de categorías
   * @param event Evento del checkbox
   * @param idCategoria ID de la categoría
   */
  onCategoriaChange(event: any, idCategoria: number): void {
    const idsCategorias: number[] = this.repuestoForm.get('idsCategorias')?.value || [];

    if (event.target.checked) {
      // Agregar categoría
      if (!idsCategorias.includes(idCategoria)) {
        idsCategorias.push(idCategoria);
      }
    } else {
      // Remover categoría
      const index = idsCategorias.indexOf(idCategoria);
      if (index > -1) {
        idsCategorias.splice(index, 1);
      }
    }

    this.repuestoForm.patchValue({ idsCategorias: idsCategorias });
  }

  /**
   * Verifica si una categoría está seleccionada
   * @param idCategoria ID de la categoría
   * @returns true si está seleccionada
   */
  isCategoriaSelecionada(idCategoria: number): boolean {
    const idsCategorias: number[] = this.repuestoForm.get('idsCategorias')?.value || [];
    return idsCategorias.includes(idCategoria);
  }

  /**
   * Guarda el repuesto (crear o actualizar según el modo)
   */
  guardarRepuesto(): void {
    // Validar el formulario
    if (this.repuestoForm.invalid) {
      this.marcarCamposComoTocados();
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }

    // Validar que al menos una categoría esté seleccionada
    const idsCategorias = this.repuestoForm.get('idsCategorias')?.value;
    if (!idsCategorias || idsCategorias.length === 0) {
      alert('Debe seleccionar al menos una categoría.');
      return;
    }

    this.isSaving = true;
    const repuesto: Repuesto = this.repuestoForm.value;

    if (this.modoEdicion) {
      // Actualizar repuesto existente
      this.repuestoService.actualizarRepuesto(repuesto).subscribe({
        next: (response) => {
          alert('Repuesto actualizado exitosamente');
          this.router.navigate(['/repuestos']);
        },
        error: (error) => {
          console.error('Error al actualizar repuesto:', error);
          alert('Error al actualizar el repuesto. Por favor, intente nuevamente.');
          this.isSaving = false;
        },
      });
    } else {
      // Crear nuevo repuesto
      repuesto.idRepuesto = null;
      this.repuestoService.crearRepuesto(repuesto).subscribe({
        next: (response) => {
          alert('Repuesto creado exitosamente');
          this.router.navigate(['/repuestos']);
        },
        error: (error) => {
          console.error('Error al crear repuesto:', error);
          alert('Error al crear el repuesto. Por favor, intente nuevamente.');
          this.isSaving = false;
        },
      });
    }
  }

  /**
   * Marca todos los campos del formulario como tocados para mostrar errores
   */
  marcarCamposComoTocados(): void {
    Object.keys(this.repuestoForm.controls).forEach((key) => {
      this.repuestoForm.get(key)?.markAsTouched();
    });
  }

  /**
   * Cancela la operación y vuelve a la lista
   */
  cancelar(): void {
    if (confirm('¿Está seguro de cancelar? Los cambios no guardados se perderán.')) {
      this.router.navigate(['/repuestos']);
    }
  }

  /**
   * Verifica si un campo tiene errores y ha sido tocado
   * @param campo Nombre del campo a verificar
   * @returns true si el campo tiene errores y ha sido tocado
   */
  mostrarError(campo: string): boolean {
    const control = this.repuestoForm.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   * @param campo Nombre del campo
   * @returns Mensaje de error
   */
  obtenerMensajeError(campo: string): string {
    const control = this.repuestoForm.get(campo);

    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }

    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Debe tener al menos ${minLength} caracteres`;
    }

    if (control?.hasError('min')) {
      return 'El valor debe ser mayor o igual a 0';
    }

    if (control?.hasError('pattern')) {
      return 'Debe ser un número entero';
    }

    return '';
  }
}
