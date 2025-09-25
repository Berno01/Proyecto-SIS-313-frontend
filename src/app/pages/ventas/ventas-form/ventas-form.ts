import { Component, EventEmitter, Output, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Para API
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-ventas-form',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule], // Importa Http para standalone
  templateUrl: './ventas-form.html',
  styleUrl: './ventas-form.css'
})
export class VentasForm {
  @Output() onActualizarGenerales = new EventEmitter<string>();
  @Output() onAgregarRepuesto = new EventEmitter<{ id_repuesto: number, nombre_repuesto?: string, cant_venta: number, precio_compra: number, precio_venta: number }>();

  generalesForm: FormGroup;
  repuestoForm: FormGroup;

  // Datos fetched de API
  fetchedRepuesto = { precio_compra: 0, precio_venta: 0, nombre_repuesto: '' };
  errorMessage = '';

  private http = inject(HttpClient); // Inyecta HttpClient
  private fb = inject(FormBuilder);

  constructor() {
    this.generalesForm = this.fb.group({
      nombreCliente: ['', Validators.required]
    });
    this.repuestoForm = this.fb.group({
      id_repuesto: [0, [Validators.required, Validators.min(1)]],
      cant_venta: [0, [Validators.required, Validators.min(1)]]
    });
  }

  submitGenerales() {
    if (this.generalesForm.valid) {
      this.onActualizarGenerales.emit(this.generalesForm.value.nombreCliente);
    }
  }

  // Función para buscar repuesto via API
  buscarRepuesto() {
    const id = this.repuestoForm.value.id_repuesto;
    if (!id) return;

    this.http.get<any>(`http://localhost:8080/api/v1/repuesto/${id}`).subscribe({
      next: (data) => {
        this.fetchedRepuesto = {
          precio_compra: data.precio_compra || 0,
          precio_venta: data.precio_venta || 0,
          nombre_repuesto: data.nombre_repuesto || '' // Opcional, si la API lo devuelve
        };
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'Error al fetch repuesto: ' + err.message;
        this.fetchedRepuesto = { precio_compra: 0, precio_venta: 0, nombre_repuesto: '' };
      }
    });
  }

  submitRepuesto() {
    if (this.repuestoForm.valid && this.fetchedRepuesto.precio_venta > 0) { // Asegura que se buscó
      const repuesto = {
        id_repuesto: this.repuestoForm.value.id_repuesto,
        cant_venta: this.repuestoForm.value.cant_venta,
        precio_compra: this.fetchedRepuesto.precio_compra,
        precio_venta: this.fetchedRepuesto.precio_venta,
        nombre_repuesto: this.fetchedRepuesto.nombre_repuesto // Opcional
      };
      this.onAgregarRepuesto.emit(repuesto);
      this.repuestoForm.reset();
      this.fetchedRepuesto = { precio_compra: 0, precio_venta: 0, nombre_repuesto: '' }; // Reset
    } else {
      this.errorMessage = 'Busca el repuesto primero y completa los campos.';
    }
  }
}