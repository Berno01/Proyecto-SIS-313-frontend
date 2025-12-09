import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetalleVenta } from '../../models/detalle-venta.model';
import { Repuesto } from '../../models/repuesto.model';

/**
 * Componente para mostrar y editar un item individual del detalle de venta
 */
@Component({
  selector: 'app-detalle-venta-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-venta-item.component.html',
  styleUrls: ['./detalle-venta-item.component.css'],
})
export class DetalleVentaItemComponent {
  @Input() detalle!: DetalleVenta;
  @Input() repuesto!: Repuesto;
  @Input() index!: number;

  @Output() detalleChange = new EventEmitter<void>();
  @Output() eliminar = new EventEmitter<number>();

  /**
   * Actualiza el precio unitario y recalcula el total
   */
  onPrecioChange(): void {
    if (this.detalle.precio_unitario_repuesto > 0) {
      this.detalle.total = this.detalle.cantidad * this.detalle.precio_unitario_repuesto;
      this.detalleChange.emit();
    }
  }

  /**
   * Actualiza la cantidad y recalcula el total
   */
  onCantidadChange(): void {
    if (this.detalle.cantidad > 0 && this.detalle.cantidad <= this.repuesto.stockRepuesto) {
      this.detalle.total = this.detalle.cantidad * this.detalle.precio_unitario_repuesto;
      this.detalleChange.emit();
    }
  }

  /**
   * Emite el evento para eliminar este item
   */
  onEliminar(): void {
    this.eliminar.emit(this.index);
  }
}
