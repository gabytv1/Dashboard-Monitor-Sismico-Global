#!/usr/bin/env python3
"""
csv_a_json.py - Transforma el CSV de sismos del USGS a JSON con tipos validados.

Qué hace:
  1. Lee el CSV (UTF-8) con el módulo csv de Python.
  2. Limpia espacios en blanco (extremos y repetidos) en todos los valores.
  3. Convierte cada columna a su tipo: número, entero, fecha ISO 8601 (UTC) o texto.
  4. Trata los vacíos como null y descarta los registros sin campos obligatorios
     o con id repetido, dejándolos registrados en un archivo de rechazados.
  5. Escribe el JSON y muestra un resumen.

Uso:
  python scripts/csv_a_json.py data/earthquakes.csv data/earthquakes.json
  python scripts/csv_a_json.py data/earthquakes.csv data/earthquakes.json --por-id

Solo usa la biblioteca estándar (Python 3.9 o superior).
"""
import argparse
import csv
import json
import math
import re
import sys
from collections import Counter
from datetime import datetime, timedelta, timezone
from pathlib import Path

# Columna del CSV del USGS -> tipo en el JSON
ESQUEMA = {
    "time": "fecha", "latitude": "numero", "longitude": "numero", "depth": "numero",
    "mag": "numero", "magType": "texto", "nst": "entero", "gap": "numero",
    "dmin": "numero", "rms": "numero", "net": "texto", "id": "texto",
    "updated": "fecha", "place": "texto", "type": "texto",
    "horizontalError": "numero", "depthError": "numero", "magError": "numero",
    "magNst": "entero", "status": "texto", "locationSource": "texto", "magSource": "texto",
}
# Sin estos campos el registro no sirve para el dashboard y se descarta
OBLIGATORIOS = ("id", "time", "latitude", "longitude", "mag")

FECHA_RE = re.compile(
    r"^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,6}))?(Z|[+-]\d{2}:?\d{2})?$"
)


def limpiar(valor):
    """Quita espacios al inicio, al final y repetidos; None si queda vacío."""
    if valor is None:
        return None
    valor = " ".join(valor.split())  # también cubre tabulaciones y espacios no separables
    return valor or None


def a_numero(texto):
    n = float(texto)
    if not math.isfinite(n):
        raise ValueError("número no finito")
    return n


def a_entero(texto):
    n = float(texto)
    if not math.isfinite(n) or not n.is_integer():
        raise ValueError("no es un entero")
    return int(n)


def a_fecha_iso(texto):
    """Devuelve la fecha como 'AAAA-MM-DDThh:mm:ss.mmmZ' (UTC)."""
    m = FECHA_RE.match(texto)
    if not m:
        raise ValueError("formato de fecha no reconocido")
    y, mo, d, h, mi, s, frac, zona = m.groups()
    micro = int((frac or "0").ljust(6, "0"))
    dt = datetime(int(y), int(mo), int(d), int(h), int(mi), int(s), micro, tzinfo=timezone.utc)
    if zona and zona != "Z":
        signo = 1 if zona[0] == "+" else -1
        zz = zona[1:].replace(":", "")
        dt -= signo * timedelta(hours=int(zz[:2]), minutes=int(zz[2:]))
    return dt.strftime("%Y-%m-%dT%H:%M:%S.") + f"{dt.microsecond // 1000:03d}Z"


CONVERSORES = {"numero": a_numero, "entero": a_entero, "fecha": a_fecha_iso, "texto": lambda t: t}


def transformar(ruta_csv):
    registros, rechazados = [], []
    stats = Counter()
    ids_vistos = set()
    with open(ruta_csv, newline="", encoding="utf-8-sig") as f:
        lector = csv.DictReader(f)
        columnas = lector.fieldnames or []
        faltan = [c for c in OBLIGATORIOS if c not in columnas]
        if faltan:
            sys.exit(f"ERROR: el CSV no tiene las columnas obligatorias: {', '.join(faltan)}")
        ausentes = [c for c in ESQUEMA if c not in columnas]
        extras = [c for c in columnas if c not in ESQUEMA]
        for fila_n, fila in enumerate(lector, start=2):  # la fila 1 es el encabezado
            stats["filas_csv"] += 1
            registro, motivos = {}, []
            for col, tipo in ESQUEMA.items():
                if col not in columnas:
                    registro[col] = None
                    continue
                crudo = fila.get(col)
                if crudo is not None and crudo != crudo.strip():
                    stats["valores_con_espacios_corregidos"] += 1
                texto = limpiar(crudo)
                if texto is None:
                    registro[col] = None
                    stats[f"vacios:{col}"] += 1
                    continue
                try:
                    registro[col] = CONVERSORES[tipo](texto)
                except ValueError as e:
                    registro[col] = None
                    stats[f"invalidos:{col}"] += 1
                    motivos.append(f"{col}='{texto}' ({e})")
            faltantes = [c for c in OBLIGATORIOS if registro.get(c) is None]
            if faltantes:
                rechazados.append((fila_n, registro.get("id") or fila.get("id"), "falta o es inválido: " + ", ".join(faltantes)))
                stats["rechazados_obligatorio"] += 1
                continue
            if registro["id"] in ids_vistos:
                rechazados.append((fila_n, registro["id"], "id repetido"))
                stats["rechazados_duplicado"] += 1
                continue
            ids_vistos.add(registro["id"])
            registros.append(registro)
            if motivos:
                stats["registros_con_valor_invalido_a_null"] += 1
    return registros, rechazados, stats, ausentes, extras


def main():
    ap = argparse.ArgumentParser(description="Convierte el CSV de sismos del USGS a JSON.")
    ap.add_argument("csv", help="ruta del CSV de entrada")
    ap.add_argument("json", help="ruta del JSON de salida")
    ap.add_argument("--por-id", action="store_true",
                    help="escribe un objeto {id: registro} (útil para importar a Firebase Realtime Database)")
    args = ap.parse_args()

    registros, rechazados, stats, ausentes, extras = transformar(args.csv)

    salida = Path(args.json)
    salida.parent.mkdir(parents=True, exist_ok=True)
    contenido = {r["id"]: r for r in registros} if args.por_id else registros
    with open(salida, "w", encoding="utf-8") as f:
        json.dump(contenido, f, ensure_ascii=False, indent=2)
        f.write("\n")

    if rechazados:
        ruta_rech = salida.with_suffix(".rechazados.csv")
        with open(ruta_rech, "w", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            w.writerow(["fila_csv", "id", "motivo"])
            w.writerows(rechazados)

    print("== Resumen de la transformación ==")
    print(f"Filas leídas del CSV      : {stats['filas_csv']}")
    print(f"Registros escritos al JSON: {len(registros)}")
    print(f"Registros descartados     : {len(rechazados)} "
          f"(campos obligatorios: {stats['rechazados_obligatorio']}, id repetido: {stats['rechazados_duplicado']})")
    print(f"Valores con espacios corregidos: {stats['valores_con_espacios_corregidos']}")
    print(f"Registros con algún valor inválido convertido a null: {stats['registros_con_valor_invalido_a_null']}")
    invalidos = {k.split(':', 1)[1]: v for k, v in stats.items() if k.startswith("invalidos:")}
    if invalidos:
        print("Valores inválidos por columna:", invalidos)
    if ausentes:
        print("Columnas del esquema que no vienen en el CSV (quedan en null):", ", ".join(ausentes))
    if extras:
        print("Columnas del CSV que no están en el esquema (se ignoran):", ", ".join(extras))
    print(f"Archivo generado: {salida}" + (" (formato objeto por id)" if args.por_id else " (arreglo de registros)"))
    if rechazados:
        print(f"Detalle de descartados: {salida.with_suffix('.rechazados.csv')}")


if __name__ == "__main__":
    main()
