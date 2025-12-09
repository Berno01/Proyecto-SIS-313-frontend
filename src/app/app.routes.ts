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
import { RepuestoFormCompletoComponent } from './pages/repuesto/repuesto-form-completo/repuesto-form-completo.component';
import { DashboardFlashComponent } from './pages/dashboard-flash/dashboard-flash.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'dashboard-flash', pathMatch: 'full' },
  { path: 'ventas', component: VentasListComponent, canActivate: [authGuard] },
  { path: 'venta', component: VentaComponent, canActivate: [authGuard] },
  { path: 'venta/:id', component: VentaComponent, canActivate: [authGuard] },
  { path: 'compras', component: ComprasListComponent, canActivate: [authGuard] },
  { path: 'compra', component: CompraComponent, canActivate: [authGuard] },
  { path: 'compra/:id', component: CompraComponent, canActivate: [authGuard] },
  { path: 'categorias', component: CategoriaListComponent, canActivate: [authGuard] },
  { path: 'categoria', component: CategoriaFormComponent, canActivate: [authGuard] },
  { path: 'categoria/:id', component: CategoriaFormComponent, canActivate: [authGuard] },
  { path: 'repuestos', component: RepuestoListComponent, canActivate: [authGuard] },
  { path: 'repuesto', component: RepuestoFormComponent, canActivate: [authGuard] },
  { path: 'repuesto/:id', component: RepuestoFormComponent, canActivate: [authGuard] },
  { path: 'repuestos/nuevo', component: RepuestoFormCompletoComponent, canActivate: [authGuard] },
  {
    path: 'repuestos/editar/:id',
    component: RepuestoFormCompletoComponent,
    canActivate: [authGuard],
  },
  { path: 'dashboard-flash', component: DashboardFlashComponent, canActivate: [authGuard] },
];
