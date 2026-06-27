import { useEffect } from "react";
import api from "../api/api";

export function useNotificationsStream(onEvent) {
  useEffect(() => {
    if (!onEvent) return undefined;

    const stream = new EventSource(api.eventsURL);

    stream.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        onEvent(parsed);
      } catch {
        return;
      }
    };

    stream.onerror = () => {
      stream.close();
    };

    return () => {
      stream.close();
    };
  }, [onEvent]);
}

export default useNotificationsStream;