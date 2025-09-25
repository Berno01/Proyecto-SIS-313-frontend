import { Routes } from '@angular/router';
import { Ventas } from './pages/ventas/ventas';
import { Home } from './pages/home/home';

export const routes: Routes = [
    { path: 'ventas', component: Ventas },
    { path: '', component: Home }

];
