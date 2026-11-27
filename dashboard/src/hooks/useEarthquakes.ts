import { useCallback, useEffect, useState } from 'react';
import { subscribeToEarthquakes } from '../services/earthquakeService';
import type { DataStatus, EarthquakeEvent } from '../types/earthquake';

interface UseEarthquakesResult {
  events: EarthquakeEvent[];
  status: DataStatus; // 'loading' | 'success' | 'error'
  error: string | null;
  lastUpdated: number | null;
  now: number;
  retry: () => void;
}

// Hook que conecta el servicio de Firebase con el estado de React.
export function useEarthquakes(): UseEarthquakesResult {
  const [events, setEvents] = useState<EarthquakeEvent[]>([]);
  const [status, setStatus] = useState<DataStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // Se ejecuta al montar el componente y solo vuelve a ejecutarse si el
    // usuario pulsa «Reintentar» (cambia "attempt").
    setStatus('loading');
    const unsubscribe = subscribeToEarthquakes(
      (data) => {
        setEvents(data);
        setError(null);
        setStatus('success');
        setLastUpdated(Date.now());
      },
      (err) => {
        setError(err.message);
        setStatus('error');
      },
    );
    // Al desmontar (o antes de reintentar) se cancela la suscripción.
    return unsubscribe;
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  // Los datos son una copia del catálogo del 17 oct al 16 nov de 2026: el sismo
  // más reciente hace de "ahora" para calcular los rangos de 1 h, 24 h, 7 d y 30 d.
  const now = events.length > 0 ? events[0].time : Date.now();

  return { events, status, error, lastUpdated, now, retry };
}
