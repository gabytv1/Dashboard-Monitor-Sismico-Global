// Acceso a los sismos guardados en Firebase Realtime Database (nodo "earthquakes").
// Los componentes no usan el SDK directamente: llaman a este servicio.
import { onValue, ref, type DataSnapshot, type Unsubscribe } from 'firebase/database';
import { database } from '../firebase/firebase';
import type { EarthquakeEvent } from '../types/earthquake';
import { getRegion } from '../utils/region';

const EARTHQUAKES_PATH = 'earthquakes';

// Forma de cada registro tal como se importó desde data/earthquakes_firebase.json.
// Firebase no guarda los campos con valor null, por eso varios son opcionales.
interface FirebaseEarthquake {
  id: string;
  time: string; // ISO 8601 UTC
  place?: string;
  mag: number;
  magType?: string;
  depth?: number;
  type?: string;
  status?: string;
  net?: string;
  nst?: number;
  latitude: number;
  longitude: number;
}

function toEvent(raw: FirebaseEarthquake): EarthquakeEvent {
  return {
    id: raw.id,
    time: Date.parse(raw.time),
    place: raw.place ?? 'Ubicación no disponible',
    region: getRegion(raw.place),
    mag: raw.mag,
    magType: raw.magType ?? '',
    depth: raw.depth ?? 0,
    type: raw.type ?? 'earthquake',
    status: raw.status === 'reviewed' ? 'reviewed' : 'automatic',
    net: raw.net ?? '',
    nst: raw.nst ?? null,
    latitude: raw.latitude,
    longitude: raw.longitude,
    url: `https://earthquake.usgs.gov/earthquakes/eventpage/${raw.id}`,
  };
}

// Se suscribe al nodo "earthquakes" con onValue: entrega los registros al
// conectarse y otra vez cada vez que cambian en la base de datos.
// Retorna la función que cancela la suscripción.
export function subscribeToEarthquakes(
  onData: (events: EarthquakeEvent[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const earthquakesRef = ref(database, EARTHQUAKES_PATH);
  return onValue(
    earthquakesRef,
    (snapshot: DataSnapshot) => {
      const value = (snapshot.val() ?? {}) as Record<string, FirebaseEarthquake>;
      const events = Object.values(value)
        .map(toEvent)
        .sort((a, b) => b.time - a.time); // más recientes primero
      onData(events);
    },
    onError,
  );
}
