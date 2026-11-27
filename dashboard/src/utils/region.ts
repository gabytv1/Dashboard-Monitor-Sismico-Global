// Obtiene la región (país o estado) a partir del texto libre de "place".
// Ejemplos: "10 km WNW of The Geysers, CA" -> "California";
//           "Kuril Islands, Russia" -> "Rusia";
//           "south of the Fiji Islands" -> "Fiyi".

const ALIASES: Record<string, string> = {
  CA: 'California',
  NV: 'Nevada',
  MX: 'México',
  Mexico: 'México',
  Hawaii: 'Hawái',
  'New Mexico': 'Nuevo México',
  'U.S. Virgin Islands': 'Islas Vírgenes (EE. UU.)',
  Canada: 'Canadá',
  Russia: 'Rusia',
  Japan: 'Japón',
  Peru: 'Perú',
  Panama: 'Panamá',
  Philippines: 'Filipinas',
  'Dominican Republic': 'República Dominicana',
  'Burma (Myanmar)': 'Myanmar',
  'Papua New Guinea': 'Papúa Nueva Guinea',
  Iceland: 'Islandia',
  'Fiji Islands': 'Fiyi',
  Fiji: 'Fiyi',
  Afghanistan: 'Afganistán',
  Greece: 'Grecia',
  'Solomon Islands': 'Islas Salomón',
  'Timor Leste': 'Timor Oriental',
  Iran: 'Irán',
  'New Zealand': 'Nueva Zelanda',
  Italy: 'Italia',
  Turkey: 'Turquía',
  Taiwan: 'Taiwán',
  Pakistan: 'Pakistán',
  Kyrgyzstan: 'Kirguistán',
  Tajikistan: 'Tayikistán',
  Ethiopia: 'Etiopía',
  Poland: 'Polonia',
  Romania: 'Rumania',
  'Mariana Islands': 'Islas Marianas',
  'Kermadec Islands': 'Islas Kermadec',
  'Kuril Islands': 'Islas Kuriles',
  'New Caledonia': 'Nueva Caledonia',
  'Sandwich Islands': 'Islas Sandwich del Sur',
  'Easter Island': 'Isla de Pascua',
  'Galapagos Triple Junction': 'Galápagos',
  Africa: 'África',
};

const COAST_PREFIX = /^(off|near) the (\w+ )?coast of\s+/i;
// "south of ..." o "Southeast of ..." (con "of"), y adjetivos como "Southeastern Alaska".
const DIRECTION_PREFIX =
  /^((north|south|east|west|northeast|northwest|southeast|southwest)\s+of|northern|southern|eastern|western|central|northeastern|northwestern|southeastern|southwestern)\s+/i;
const ARTICLE_PREFIX = /^the\s+/i;
const REGION_SUFFIX = /\s+region$/i;

export function getRegion(place: string | null | undefined): string {
  if (!place) return 'Desconocida';
  const text = place.trim();
  const commaIndex = text.lastIndexOf(', ');
  let region = commaIndex >= 0 ? text.slice(commaIndex + 2) : text;

  // Lugares sin país al final: se quitan las palabras de orientación.
  for (let i = 0; i < 2; i += 1) {
    region = region
      .replace(COAST_PREFIX, '')
      .replace(DIRECTION_PREFIX, '')
      .replace(ARTICLE_PREFIX, '')
      .trim();
  }
  region = region.replace(REGION_SUFFIX, '').trim();

  if (region.length === 0) return 'Desconocida';
  region = region.charAt(0).toUpperCase() + region.slice(1);
  return ALIASES[region] ?? region;
}
