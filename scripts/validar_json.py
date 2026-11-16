#!/usr/bin/env python3
"""
validar_json.py - Valida el JSON generado por csv_a_json.py.

Comprueba: estructura, cantidad de registros (contra el CSV), tipos de cada campo,
formato de fechas, rangos, espacios en blanco, duplicados y valores faltantes.

Uso:
  python scripts/validar_json.py data/earthquakes.json --csv data/earthquakes.csv
  python scripts/validar_json.py data/earthquakes.json --csv data/earthquakes.csv --muestra 3 --salida docs/reporte_validacion.txt

Código de salida: 0 si no hay errores, 1 si hay errores.
"""
import argparse
import csv
import json
import re
import sys
from collections import Counter
from datetime import datetime

ESQUEMA = {
    "time": "fecha", "latitude": "numero", "longitude": "numero", "depth": "numero",
    "mag": "numero", "magType": "texto", "nst": "entero", "gap": "numero",
    "dmin": "numero", "rms": "numero", "net": "texto", "id": "texto",
    "updated": "fecha", "place": "texto", "type": "texto",
    "horizontalError": "numero", "depthError": "numero", "magError": "numero",
    "magNst": "entero", "status": "texto", "locationSource": "texto", "magSource": "texto",
}
OBLIGATORIOS = ("id", "time", "latitude", "longitude", "mag")
RANGOS = {  # campo: (mínimo, máximo) razonables para sismos
    "latitude": (-90, 90), "longitude": (-180, 180), "mag": (-5, 10), "depth": (-10, 800),
    "nst": (0, None), "gap": (0, 360), "dmin": (0, None), "rms": (0, None),
    "magNst": (0, None), "horizontalError": (0, None), "depthError": (0, None), "magError": (0, None),
}
CATEGORICAS = ("status", "type", "magType", "net")
FECHA_ISO = re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$")


class Informe:
    def __init__(self):
        self.lineas, self.errores, self.avisos = [], 0, 0

    def p(self, txt=""):
        self.lineas.append(txt)

    def ok(self, txt):
        self.p(f"[OK]    {txt}")

    def error(self, txt):
        self.errores += 1
        self.p(f"[ERROR] {txt}")

    def aviso(self, txt):
        self.avisos += 1
        self.p(f"[AVISO] {txt}")


def es_tipo(v, tipo):
    if v is None:
        return True  # los nulos se cuentan aparte
    if isinstance(v, bool):
        return False
    if tipo == "numero":
        return isinstance(v, (int, float))
    if tipo == "entero":
        return isinstance(v, int)
    return isinstance(v, str)


def leer_csv(ruta):
    with open(ruta, newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def main():
    ap = argparse.ArgumentParser(description="Valida el JSON de sismos.")
    ap.add_argument("json")
    ap.add_argument("--csv", help="CSV original, para comparar la cantidad de registros")
    ap.add_argument("--muestra", type=int, default=0, help="muestra los primeros N registros")
    ap.add_argument("--salida", help="guarda el informe en este archivo de texto")
    args = ap.parse_args()
    inf = Informe()
    inf.p("== Informe de validación del JSON ==")
    inf.p(f"Archivo: {args.json}")

    # 1. Estructura general
    try:
        with open(args.json, encoding="utf-8") as f:
            datos = json.load(f)
    except (OSError, json.JSONDecodeError) as e:
        print(f"ERROR: no se pudo leer el JSON: {e}")
        sys.exit(1)
    if isinstance(datos, dict):
        formato = "objeto por id"
        registros = list(datos.values())
        if any(k != r.get("id") for k, r in datos.items() if isinstance(r, dict)):
            inf.error("alguna clave del objeto no coincide con el id del registro")
    elif isinstance(datos, list):
        formato = "arreglo de registros"
        registros = datos
    else:
        print("ERROR: el JSON debe ser un arreglo o un objeto")
        sys.exit(1)
    inf.ok(f"JSON válido, formato: {formato}")
    if not all(isinstance(r, dict) for r in registros):
        inf.error("hay elementos que no son objetos")
        registros = [r for r in registros if isinstance(r, dict)]
    n = len(registros)
    inf.p(f"Registros en el JSON: {n}")

    # 2. Cantidad de registros frente al CSV
    if args.csv:
        filas = leer_csv(args.csv)
        inf.p(f"Filas de datos en el CSV: {len(filas)}")
        sin_obligatorio = [f for f in filas if any(not (f.get(c) or "").strip() for c in OBLIGATORIOS)]
        ids_csv = [(f.get("id") or "").strip() for f in filas if (f.get("id") or "").strip()]
        repetidos = len(ids_csv) - len(set(ids_csv))
        esperado_max = len(filas) - len(sin_obligatorio) - repetidos
        inf.p(f"  con algún campo obligatorio vacío: {len(sin_obligatorio)}; ids repetidos: {repetidos}")
        if n == len(filas):
            inf.ok("el JSON tiene la misma cantidad de registros que el CSV")
        elif n <= esperado_max:
            inf.aviso(f"el JSON tiene {len(filas) - n} registros menos que el CSV "
                      f"(descartados por campos obligatorios, ids repetidos o valores inválidos; ver *.rechazados.csv)")
        else:
            inf.error(f"el JSON tiene más registros de los esperables ({n} > {esperado_max})")
        ids_json = {r.get("id") for r in registros}
        ajenos = ids_json - set(ids_csv)
        if ajenos:
            inf.error(f"{len(ajenos)} ids del JSON no existen en el CSV")
        else:
            inf.ok("todos los ids del JSON existen en el CSV")

    # 3. Claves de cada registro
    esperadas = set(ESQUEMA)
    mal = sum(1 for r in registros if set(r) != esperadas)
    (inf.error if mal else inf.ok)(
        f"{mal} registros con claves distintas al esquema" if mal else "todos los registros tienen exactamente las 22 claves del esquema")

    # 4. Tipos, nulos, espacios y fechas
    nulos, tipos_mal, espacios, fecha_mal, fuera_rango = Counter(), Counter(), Counter(), Counter(), Counter()
    for r in registros:
        for col, tipo in ESQUEMA.items():
            v = r.get(col)
            if v is None:
                nulos[col] += 1
                continue
            if not es_tipo(v, tipo if tipo != "fecha" else "texto"):
                tipos_mal[col] += 1
                continue
            if tipo == "texto" or tipo == "fecha":
                if v != " ".join(v.split()):
                    espacios[col] += 1
            if tipo == "fecha":
                if not FECHA_ISO.match(v):
                    fecha_mal[col] += 1
                else:
                    try:
                        datetime.strptime(v, "%Y-%m-%dT%H:%M:%S.%fZ")
                    except ValueError:
                        fecha_mal[col] += 1
            if col in RANGOS:
                lo, hi = RANGOS[col]
                if (lo is not None and v < lo) or (hi is not None and v > hi):
                    fuera_rango[col] += 1
    (inf.error if tipos_mal else inf.ok)(
        f"tipos incorrectos: {dict(tipos_mal)}" if tipos_mal else "todos los valores tienen el tipo esperado (números, enteros, texto, fechas)")
    (inf.error if fecha_mal else inf.ok)(
        f"fechas fuera del formato ISO 8601 UTC: {dict(fecha_mal)}" if fecha_mal else "todas las fechas están en formato ISO 8601 UTC (AAAA-MM-DDThh:mm:ss.mmmZ)")
    (inf.error if espacios else inf.ok)(
        f"textos con espacios sobrantes: {dict(espacios)}" if espacios else "no hay espacios sobrantes en los textos")
    (inf.error if fuera_rango else inf.ok)(
        f"valores fuera de rango: {dict(fuera_rango)}" if fuera_rango else "todos los valores numéricos están dentro de rangos razonables")
    oblig_nulos = {c: nulos[c] for c in OBLIGATORIOS if nulos[c]}
    (inf.error if oblig_nulos else inf.ok)(
        f"campos obligatorios con null: {oblig_nulos}" if oblig_nulos else "los campos obligatorios (id, time, latitude, longitude, mag) no tienen nulos")
    ids = [r.get("id") for r in registros]
    dup = len(ids) - len(set(ids))
    (inf.error if dup else inf.ok)(f"{dup} ids repetidos" if dup else "no hay ids repetidos")
    inc = sum(1 for r in registros if r.get("time") and r.get("updated") and r["updated"] < r["time"])
    (inf.aviso if inc else inf.ok)(
        f"{inc} registros con 'updated' anterior a 'time'" if inc else "'updated' nunca es anterior a 'time'")

    # 5. Valores faltantes por campo
    inf.p("")
    inf.p("Valores faltantes (null) por campo:")
    for col in ESQUEMA:
        pct = 100 * nulos[col] / n if n else 0
        inf.p(f"  {col:<16}{nulos[col]:>6}  ({pct:5.1f} %)")

    # 6. Categorías
    inf.p("")
    inf.p("Valores de las variables categóricas:")
    for col in CATEGORICAS:
        c = Counter(r.get(col) for r in registros)
        top = ", ".join(f"{k if k is not None else 'null'}: {v}" for k, v in c.most_common(8))
        extra = f" … ({len(c)} distintos)" if len(c) > 8 else ""
        inf.p(f"  {col:<8}{top}{extra}")
    if registros:
        inf.p("")
        for col in ("time", "mag", "depth"):
            vals = [r[col] for r in registros if r.get(col) is not None]
            if vals:
                inf.p(f"Rango de {col}: {min(vals)}  →  {max(vals)}")

    inf.p("")
    inf.p(f"Resultado: {inf.errores} errores, {inf.avisos} avisos")
    if args.muestra:
        inf.p("")
        inf.p(f"Primeros {args.muestra} registros:")
        inf.p(json.dumps(registros[:args.muestra], ensure_ascii=False, indent=2))

    texto = "\n".join(inf.lineas)
    print(texto)
    if args.salida:
        with open(args.salida, "w", encoding="utf-8") as f:
            f.write(texto + "\n")
    sys.exit(1 if inf.errores else 0)


if __name__ == "__main__":
    main()
