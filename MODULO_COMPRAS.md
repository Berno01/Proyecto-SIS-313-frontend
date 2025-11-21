# Módulo de Compras

Este módulo fue creado siguiendo la misma estructura y lógica del módulo de Ventas existente, adaptado para gestionar compras de repuestos a proveedores.

## 📁 Estructura del Proyecto

```
src/app/pages/
├── compra/
│   ├── compra.component.ts          # Componente principal (crear/editar compras)
│   ├── compra.component.html
│   ├── compra.component.css
│   ├── components/
│   │   ├── modal-repuestos-compra/  # Modal para seleccionar repuestos
│   │   │   ├── modal-repuestos-compra.component.ts
│   │   │   ├── modal-repuestos-compra.component.html
│   │   │   └── modal-repuestos-compra.component.css
│   │   └── detalle-compra-item/     # Item individual de detalle
│   │       ├── detalle-compra-item.component.ts
│   │       ├── detalle-compra-item.component.html
│   │       └── detalle-compra-item.component.css
│   ├── models/
│   │   ├── compra.model.ts          # Modelos Request/Response
│   │   └── detalle-compra.model.ts  # Modelo de detalle
│   └── services/
│       └── compra.service.ts        # Servicio HTTP para API
└── compras-list/
    ├── compras-list.component.ts    # Lista de todas las compras
    ├── compras-list.component.html
    └── compras-list.component.css
```

## 🎯 Funcionalidades Implementadas

### 1. Lista de Compras (`/compras`)

- ✅ Muestra todas las compras en una tabla
- ✅ Columnas: ID, Proveedor, Fecha, Total, Estado
- ✅ Botón "Nueva Compra"
- ✅ Botones "Editar" y "Eliminar" por cada fila
- ✅ Formateo de fecha legible
- ✅ Badge de estado (Activo/Inactivo)
- ✅ Confirmación antes de eliminar

### 2. Formulario de Compra (`/compra` y `/compra/:id`)

- ✅ Campo: Nombre del Proveedor (requerido, mín 3 caracteres)
- ✅ Modal para agregar repuestos
- ✅ Lista de repuestos en el detalle
- ✅ Cálculo automático del total
- ✅ Modo crear (sin ID) y modo editar (con ID)
- ✅ Validaciones de formulario
- ✅ Guardado con POST y actualización con POST /update

### 3. Modal de Repuestos

- ✅ Lista de todos los repuestos disponibles
- ✅ Búsqueda por nombre
- ✅ Muestra: Nombre, Stock, Costo
- ✅ Formulario de cantidad y costo editable
- ✅ Cálculo de subtotal en tiempo real
- ✅ Validaciones (cantidad > 0, costo > 0)

### 4. Detalle de Compra

- ✅ Muestra cada repuesto agregado
- ✅ Campos editables inline: cantidad, costo
- ✅ Cálculo automático de subtotal por item
- ✅ Botón eliminar por item
- ✅ Actualización del total general

## 🔄 Endpoints Utilizados

```typescript
// Listar todas las compras
GET http://localhost:8080/api/compras/findAll
Response: CompraResponse[]

// Obtener compra por ID
GET http://localhost:8080/api/compras/findById/{id}
Response: CompraResponse

// Crear nueva compra
POST http://localhost:8080/api/compras
Body: CompraRequest
Response: any

// Actualizar compra existente
POST http://localhost:8080/api/compras/update
Body: CompraRequest (con id_compra)
Response: any

// Eliminar compra
GET http://localhost:8080/api/compras/delete/{id}
Response: boolean (true si se eliminó correctamente)
```

## 📊 Modelos de Datos

### CompraRequest (para enviar)

```typescript
{
  id_compra: number | null,
  nombre_proveedor: string,
  total_compra: number,
  detalle_compra: [
    {
      id_repuesto: number,
      cantidad: number,
      total: number,
      costo_repuesto: number
    }
  ]
}
```

### CompraResponse (respuesta del backend)

```typescript
{
  idCompra: number,
  nombreProveedor: string,
  fechaCompra: number[],  // [año, mes, día, hora, min, seg]
  total: number,
  estadoCompra: boolean,
  detalleCompra: [
    {
      total: number,
      cantidad: number,
      idRepuesto: number,
      costoRepuesto: number
    }
  ]
}
```

## 🎨 Diferencias con el Módulo de Ventas

| Característica    | Ventas                                | Compras                  |
| ----------------- | ------------------------------------- | ------------------------ |
| Campo principal   | `nombre_cliente`                      | `nombre_proveedor`       |
| Descuento         | ✅ Sí (`descuento_total`)             | ❌ No                    |
| Detalle - Precios | `precio_sugerido` + `precio_unitario` | Solo `costo_repuesto`    |
| Endpoint base     | `/api/ventas`                         | `/api/compras`           |
| Total             | Suma - descuento                      | Solo suma                |
| Color tema        | Verde (#4caf50)                       | Naranja (#ff9800)        |
| Validación stock  | Sí (no puede exceder)                 | No (permite comprar más) |

## 🚀 Rutas Agregadas

```typescript
{ path: 'compras', component: ComprasListComponent },  // Lista
{ path: 'compra', component: CompraComponent },        // Crear nueva
{ path: 'compra/:id', component: CompraComponent },    // Editar existente
```

## 🔧 Servicios Reutilizados

- **RepuestoService**: Se reutiliza del módulo de ventas para obtener la lista de repuestos
- **date-formatter**: Se utiliza la misma función `formatFechaVenta()` del módulo de ventas

## ✅ Validaciones Implementadas

1. **Formulario Principal**:

   - Nombre proveedor requerido (mínimo 3 caracteres)
   - Al menos 1 repuesto en el detalle
   - Total > 0

2. **Modal de Repuestos**:

   - Cantidad > 0
   - Costo > 0
   - Formulario completo antes de agregar

3. **Detalle**:
   - Cantidad mínima: 1
   - Costo mínimo: 0.01

## 🎯 Flujo de Usuario

1. Usuario navega a `/compras` → Ve lista de compras
2. Click "Nueva Compra" → Va a `/compra` (formulario vacío)
3. Ingresa nombre del proveedor
4. Click "Agregar Repuesto" → Abre modal
5. Selecciona repuesto, define cantidad y costo
6. Click "Agregar" → Cierra modal y agrega al detalle
7. Repite para más repuestos (opcional)
8. Click "Guardar Compra" → POST `/api/compras`
9. Redirección automática a `/compras` con mensaje de éxito

### Modo Edición:

1. Desde `/compras`, click "Editar" en una fila
2. Va a `/compra/:id`
3. Se carga la compra con GET `/api/compras/findById/{id}`
4. Formulario se pre-llena con datos existentes
5. Puede modificar proveedor, agregar/quitar repuestos
6. Click "Actualizar Compra" → POST `/api/compras/update`
7. Redirección automática a `/compras`

## 📝 Notas Técnicas

- Todos los componentes son **standalone**
- Se usa **Reactive Forms** para validaciones
- **HttpClient** para comunicación con la API
- **RxJS** (forkJoin) para cargar repuestos en paralelo
- **CommonModule** y **FormsModule** importados donde se necesitan
- Mismo estilo visual que ventas pero con tema naranja (#ff9800)

## 🐛 Manejo de Errores

- Try-catch en todas las peticiones HTTP
- Mensajes de error al usuario
- Loading states durante peticiones
- Validación antes de enviar al servidor
- Confirmaciones para acciones destructivas (eliminar)
