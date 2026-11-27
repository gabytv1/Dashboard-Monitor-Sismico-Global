import { useEffect, useState } from 'react';
import { subscribeToEarthquakes } from '../services/earthquakeService';
import type { EarthquakeEvent } from '../types/earthquake';

// Hook que conecta el servicio de Firebase con el estado de React.
export function useEarthquakes() {
  const [events, setEvents] = useState<EarthquakeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Se ejecuta una sola vez, al montar el componente (arreglo de dependencias vacío).
    const unsubscribe = subscribeToEarthquakes(
      (data) => {
        setEvents(data);
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
    // Al desmontar el componente se cancela la suscripción.
    return unsubscribe;
  }, []);

  return { events, loading, error };
}
