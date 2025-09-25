import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Signal } from '@angular/core'; // Importa el tipo Signal

@Component({
  selector: 'app-ventas-tabla',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ventas-tabla.html',
  styleUrl: './ventas-tabla.css'
})
export class VentasTabla {
  @Input({ required: true }) repuestos!: Signal<{ id_repuesto: number; nombre_repuesto?: string; cant_venta: number; precio_compra: number; precio_venta: number; total: number }[]>;
  
  @Input({ required: true }) totalGeneral!: Signal<number>;
}