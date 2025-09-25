import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentasForm } from './ventas-form/ventas-form';
import { VentasTabla } from './ventas-tabla/ventas-tabla';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, VentasForm, VentasTabla],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css'
})
export class Ventas {
  private http = inject(HttpClient); // Inyecta HttpClient
  
  venta = signal({
    id: 1,
    nombreCliente: '',
    repuestos: [] as { id_repuesto: number, nombre_repuesto?: string, cant_venta: number, precio_compra: number, precio_venta: number, total: number }[]
  });

  totalGeneral = computed(() => 
    this.venta().repuestos.reduce((sum, rep) => sum + rep.total, 0)
  );

  // Nuevo: Computed para repuestos como Signal
  repuestosSignal = computed(() => this.venta().repuestos);

  actualizarDatosGenerales(nombre: string) {
    this.venta.update(v => ({ ...v, nombreCliente: nombre }));
  }

  agregarRepuesto(repuesto: { id_repuesto: number, nombre_repuesto?: string, cant_venta: number, precio_compra: number, precio_venta: number }) {
    const total = repuesto.cant_venta * repuesto.precio_venta;
    this.venta.update(v => ({
      ...v,
      repuestos: [...v.repuestos, { ...repuesto, total }]
    }));
  }

  registrarVenta() {
  const cliente = this.venta().nombreCliente;
  const repuestos = this.venta().repuestos;

  if (!cliente || repuestos.length === 0) {
    alert('Agrega cliente y al menos un repuesto primero.');
    return;
  }

  // Construimos el objeto de la venta
  const datos = {
    id_venta: null, // porque se debe generar en el backend
    nombre_cliente: cliente,
    total_venta: this.totalGeneral(), // usamos el computed
    detalle_venta: repuestos.map(rep => ({
      id_repuesto: rep.id_repuesto,
      cantidad: rep.cant_venta,
      precio_compra: rep.precio_compra,
      precio_venta: rep.precio_venta,
      total: rep.total
    }))
  };

  // Enviamos un solo POST
  this.http.post<any>('http://localhost:8080/api/v1/venta/registrar', datos).subscribe({
    next: (response) => {
      console.log('Venta registrada con éxito:', response);
      alert('Venta registrada correctamente.');
      // Limpiamos el estado
      this.venta.set({ id: this.venta().id + 1, nombreCliente: '', repuestos: [] });
    },
    error: (err) => {
      console.error('Error al registrar la venta:', err);
      alert('Error: ' + err.message);
    }
  });
}


}