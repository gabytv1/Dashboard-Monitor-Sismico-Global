# Monitor Sísmico Global — Dashboard interactivo (Proyecto 03)

Dashboard con React y TypeScript que muestra sismos del Servicio Geológico de EE. UU. (USGS).
Este repositorio contiene:

- **Sprint 1:** transformación de los datos de CSV a JSON (carpetas `data/`, `scripts/` y `docs/`).
- **Sprint 2:** componentes e interfaces React con Vite, TypeScript y Material UI (carpeta `dashboard/`).

## Sprint 2: cómo ejecutar el dashboard

Requisitos: Node.js 20.19 o superior.

```bash
cd dashboard
npm install
npm run dev        # abre http://localhost:5173
```

Los datos de ejemplo (`dashboard/src/data/sampleEarthquakes.json`) son 298 sismos tomados de
`data/earthquakes.json` (uno de cada 33 registros).

```
dashboard/src/
├── main.tsx, App.tsx        # punto de entrada y tema
├── theme/theme.ts           # colores y puntos de quiebre de Material UI
├── types/earthquake.ts      # tipos compartidos
├── data/                    # datos de ejemplo
├── utils/dashboard.ts       # filtros, KPI y región
├── pages/DashboardPage.tsx  # contenedor con el estado (useState)
└── components/              # DashboardHeader, FilterBar, KpiGrid, KpiCard, ChartCard, EarthquakeTable
```

## Fuente de los datos

- Fuente: USGS Earthquake Hazards Program, *Spreadsheet (CSV) Summary Feed*.
- Enlace: https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv
  (existen también `all_hour`, `all_day` y `all_week`).
- Fecha de descarga: **[15/11/2026]**
- Archivo guardado como `data/earthquakes.csv` (sin modificar).

## Sprint 1: estructura del repositorio

```
.
├── dashboard/                   # Sprint 2: aplicación React
├── data/
│   ├── earthquakes.csv          # CSV original del USGS
│   └── earthquakes.json         # JSON generado por el script
├── scripts/
│   ├── csv_a_json.py            # transformación CSV -> JSON
│   └── validar_json.py          # validación del JSON generado
├── docs/
│   └── reporte_validacion.txt   # informe de la validación
└── README.md
```

## Requisitos

Python 3.9 o superior. No se instala ninguna biblioteca externa.

## Cómo ejecutarlo

Desde la raíz del repositorio:

```bash
# 1. Transformar el CSV a JSON
python scripts/csv_a_json.py data/earthquakes.csv data/earthquakes.json

# 2. Validar el JSON (estructura, cantidad de registros, tipos, faltantes)
python scripts/validar_json.py data/earthquakes.json --csv data/earthquakes.csv --muestra 3 --salida docs/reporte_validacion.txt
```

En Windows puede ser `py` en lugar de `python`.

Opción para Firebase Realtime Database, que importa un objeto en lugar de un arreglo:

```bash
python scripts/csv_a_json.py data/earthquakes.csv data/earthquakes.json --por-id
```

Si hay registros descartados, el script crea `data/earthquakes.rechazados.csv` con la fila, el id y el motivo.

## Procedimiento de transformación

1. Se lee el CSV con el módulo `csv` (UTF-8).
2. **Espacios en blanco:** a cada valor se le quitan los espacios del inicio y del final y los repetidos.
3. **Valores vacíos:** se guardan como `null`.
4. **Conversión de tipos:** cada columna se convierte según el esquema de abajo.
   Si un valor no se puede convertir (por ejemplo, texto en una columna numérica), queda en `null` y se cuenta en el resumen.
5. **Fechas:** `time` y `updated` se guardan como texto ISO 8601 en UTC, siempre con el formato `AAAA-MM-DDThh:mm:ss.mmmZ`.
6. **Registros descartados:** los que no tienen alguno de los campos obligatorios (`id`, `time`, `latitude`, `longitude`, `mag`)
   y los que repiten un `id`. El dashboard no puede mostrarlos sin esos datos.
7. Se escribe el JSON como arreglo de objetos, en el mismo orden del CSV.

## Esquema del JSON

| Campo | Tipo | Descripción |
|---|---|---|
| `time` | fecha (texto ISO 8601, UTC) | Fecha y hora del sismo |
| `latitude`, `longitude` | número | Coordenadas en grados |
| `depth` | número | Profundidad en km |
| `mag` | número | Magnitud |
| `magType` | texto | Método con que se calculó la magnitud |
| `nst` | entero | Estaciones sísmicas usadas |
| `gap` | número | Mayor brecha azimutal entre estaciones (grados) |
| `dmin` | número | Distancia horizontal a la estación más cercana (grados) |
| `rms` | número | Error cuadrático medio de los residuales (s) |
| `net` | texto | Red sísmica que reporta el evento |
| `id` | texto | Identificador único del evento |
| `updated` | fecha (texto ISO 8601, UTC) | Última actualización del registro |
| `place` | texto | Descripción de la ubicación |
| `type` | texto | Tipo de evento (earthquake, quarry blast, etc.) |
| `horizontalError`, `depthError`, `magError` | número | Incertidumbres de ubicación, profundidad y magnitud |
| `magNst` | entero | Estaciones usadas para la magnitud |
| `status` | texto | `automatic` o `reviewed` |
| `locationSource`, `magSource` | texto | Origen de la ubicación y de la magnitud |

## Decisiones

- **`tsunami` y `sig` no existen en el CSV.** Aparecen en el feed GeoJSON, pero el CSV no las incluye,
  así que no están en el JSON y el dashboard no las usará.
- **`region` no se calcula aquí.** El JSON conserva los datos tal como vienen; la región (país o estado al final de `place`)
  se obtendrá en el dashboard.
- Los campos de error y de estaciones suelen venir vacíos; por eso se guardan como `null` y no se descartan.

## Validación

`scripts/validar_json.py` comprueba:

- que el JSON sea válido y tenga la estructura esperada (22 claves por registro);
- que la cantidad de registros coincida con el CSV, explicando los descartados;
- que cada campo tenga el tipo correcto y que las fechas estén en formato ISO 8601;
- que no haya espacios sobrantes, ids repetidos ni valores fuera de rango;
- los valores faltantes por campo y los valores de las variables categóricas.

El informe de la última ejecución está en `docs/reporte_validacion.txt`.
