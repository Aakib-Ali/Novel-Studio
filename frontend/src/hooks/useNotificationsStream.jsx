import { useEffect, useRef } from 'react';
import { api } from '../api/api';

export function useNotificationsStream(onEvent) {
  const onEventRef = useRef(onEvent);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    const stream = new EventSource(api.eventsURL);

    stream.onmessage = (message) => {
      try {
        const parsed = JSON.parse(message.data);
        onEventRef.current?.(parsed);
      } catch (_) {}
    };

    stream.onerror = () => {};

    return () => stream.close();
  }, []);
}