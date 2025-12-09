import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

interface DashboardFlash {
  total_ganancia: number;
  ganancia_socia: number;
}

@Component({
  selector: 'app-dashboard-flash',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="header">
        <h1 class="title">Reporte de ganancias</h1>
      </div>

      <div class="cards-container" *ngIf="!loading && dashboardData">
        <div class="card card-green">
          <div class="card-header">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h2 class="card-title">Ganancia Neta Total</h2>
          </div>
          <p class="card-value">
            {{ dashboardData.total_ganancia | currency : 'BOB' : 'symbol-narrow' : '1.2-2' }}
          </p>
          <p class="card-subtitle">Ingresos acumulados</p>
        </div>

        <div class="card card-blue">
          <div class="card-header">
            <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            <h2 class="card-title">Ganancia por Socia (50%)</h2>
          </div>
          <p class="card-value">
            {{ dashboardData.ganancia_socia | currency : 'BOB' : 'symbol-narrow' : '1.2-2' }}
          </p>
          <p class="card-subtitle">Reparto equitativo</p>
        </div>
      </div>

      <div class="loading-section" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando datos financieros...</p>
      </div>

      <div class="metrics-placeholder">
        <div class="placeholder-icon">📊</div>
        <p class="placeholder-text">Cargando métricas de stock...</p>
        <div class="placeholder-bar"></div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        min-height: 100vh;
        background-color: #0f172a; /* Slate 900 */
        padding: 2rem;
        font-family: 'Inter', 'Segoe UI', sans-serif;
        color: #f8fafc;
      }

      .header {
        text-align: center;
        margin-bottom: 3rem;
        padding-top: 1rem;
      }

      .title {
        font-size: 2.5rem;
        font-weight: 700;
        color: #f8fafc;
        margin: 0;
        letter-spacing: -0.025em;
        animation: fadeInDown 0.8s ease-out;
      }

      .cards-container {
        display: flex;
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto 4rem;
        flex-wrap: wrap;
      }

      .card {
        flex: 1;
        min-width: 320px;
        background: #1e293b; /* Slate 800 */
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.05);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        animation: fadeInUp 0.8s ease-out;
      }

      .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        border-color: rgba(255, 255, 255, 0.1);
      }

      .card-green {
        border-top: 4px solid #10b981;
      }

      .card-blue {
        border-top: 4px solid #38bdf8;
      }

      .card-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .icon {
        width: 32px;
        height: 32px;
        color: #94a3b8;
      }

      .card-green .icon {
        color: #10b981;
      }

      .card-blue .icon {
        color: #38bdf8;
      }

      .card-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: #e2e8f0;
        margin: 0;
      }

      .card-value {
        font-size: 3rem;
        font-weight: 700;
        margin: 0.5rem 0 1rem;
        color: #f8fafc;
        letter-spacing: -0.025em;
      }

      .card-green .card-value {
        background: linear-gradient(to right, #34d399, #10b981);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .card-blue .card-value {
        background: linear-gradient(to right, #38bdf8, #0ea5e9);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .card-subtitle {
        font-size: 0.875rem;
        color: #94a3b8;
        margin: 0;
      }

      .loading-section {
        text-align: center;
        color: #94a3b8;
        font-size: 1.25rem;
        padding: 3rem;
      }

      .spinner {
        width: 48px;
        height: 48px;
        border: 4px solid rgba(255, 255, 255, 0.1);
        border-top-color: #38bdf8;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
      }

      .metrics-placeholder {
        max-width: 800px;
        margin: 0 auto;
        background: rgba(30, 41, 59, 0.5); /* Slate 800 with opacity */
        border-radius: 16px;
        padding: 3rem 2rem;
        text-align: center;
        border: 1px dashed rgba(255, 255, 255, 0.1);
      }

      .placeholder-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.8;
        animation: pulse 3s ease-in-out infinite;
      }

      .placeholder-text {
        font-size: 1.5rem;
        color: #e2e8f0;
        font-weight: 600;
        margin: 0 0 1.5rem;
      }

      .placeholder-bar {
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
        overflow: hidden;
        position: relative;
        max-width: 400px;
        margin: 0 auto;
      }

      .placeholder-bar::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 40%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        animation: shimmer 2s infinite;
      }

      @keyframes fadeInDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 0.8;
          transform: scale(1);
        }
        50% {
          opacity: 0.5;
          transform: scale(0.95);
        }
      }

      @keyframes shimmer {
        0% {
          left: -40%;
        }
        100% {
          left: 100%;
        }
      }

      @media (max-width: 768px) {
        .title {
          font-size: 2rem;
        }

        .cards-container {
          flex-direction: column;
        }

        .card {
          min-width: 100%;
        }

        .card-value {
          font-size: 2.5rem;
        }
      }
    `,
  ],
})
export class DashboardFlashComponent implements OnInit {
  dashboardData: DashboardFlash | null = null;
  loading = true;

  private apiUrl = `${environment.apiUrl}/dashboard/flash-ganancias`;

  constructor(private http: HttpClient) {
    console.log('DashboardFlashComponent constructor ejecutado');
  }

  ngOnInit(): void {
    console.log('ngOnInit ejecutado - iniciando carga de datos');
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    console.log('Intentando cargar datos desde:', this.apiUrl);
    this.http.get<DashboardFlash>(this.apiUrl).subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data);
        this.dashboardData = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar datos del dashboard:', error);
        this.loading = false;
        // Datos de ejemplo para pruebas
        this.dashboardData = {
          total_ganancia: 15000,
          ganancia_socia: 7500,
        };
        console.log('Usando datos de ejemplo:', this.dashboardData);
      },
    });
  }
}
