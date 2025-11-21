import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetalleCompra } from '../../models/detalle-compra.model';
import { Repuesto } from '../../../venta/models/repuesto.model';

/**
 * Componente para mostrar y editar un item individual del detalle de compra
 */
@Component({
  selector: 'app-detalle-compra-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-compra-item.component.html',
  styleUrls: ['./detalle-compra-item.component.css'],
})
export class DetalleCompraItemComponent {
  @Input() detalle!: DetalleCompra;
  @Input() repuesto!: Repuesto;
  @Input() index!: number;

  @Output() detalleChange = new EventEmitter<void>();
  @Output() eliminar = new EventEmitter<number>();

  /**
   * Actualiza el costo y recalcula el total
   */
  onCostoChange(): void {
    if (this.detalle.costo_repuesto > 0) {
      this.detalle.total = this.detalle.cantidad * this.detalle.costo_repuesto;
      this.detalleChange.emit();
    }
  }

  /**
   * Actualiza la cantidad y recalcula el total
   */
  onCantidadChange(): void {
    if (this.detalle.cantidad > 0) {
      this.detalle.total = this.detalle.cantidad * this.detalle.costo_repuesto;
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
