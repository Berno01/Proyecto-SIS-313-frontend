import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { VentaComponent } from './pages/venta/venta.component';
import { VentasListComponent } from './pages/ventas-list/ventas-list.component';
import { CompraComponent } from './pages/compra/compra.component';
import { ComprasListComponent } from './pages/compras-list/compras-list.component';
import { CategoriaListComponent } from './pages/categoria/categoria-list/categoria-list.component';
import { CategoriaFormComponent } from './pages/categoria/categoria-form/categoria-form.component';
import { RepuestoListComponent } from './pages/repuesto/repuesto-list/repuesto-list.component';
import { RepuestoFormComponent } from './pages/repuesto/repuesto-form/repuesto-form.component';
import { DashboardFlashComponent } from './pages/dashboard-flash/dashboard-flash.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard-flash', pathMatch: 'full' },
  { path: 'ventas', component: VentasListComponent },
  { path: 'venta', component: VentaComponent },
  { path: 'venta/:id', component: VentaComponent },
  { path: 'compras', component: ComprasListComponent },
  { path: 'compra', component: CompraComponent },
  { path: 'compra/:id', component: CompraComponent },
  { path: 'categorias', component: CategoriaListComponent },
  { path: 'categoria', component: CategoriaFormComponent },
  { path: 'categoria/:id', component: CategoriaFormComponent },
  { path: 'repuestos', component: RepuestoListComponent },
  { path: 'repuesto', component: RepuestoFormComponent },
  { path: 'repuesto/:id', component: RepuestoFormComponent },
  { path: 'dashboard-flash', component: DashboardFlashComponent },
];
