import { useMemo, useState } from "react";

export function useUploadProgress() {
  const [progress, setProgress] = useState(0);

  const config = useMemo(
    () => ({
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress: (event) => {
        if (!event.total) return;
        setProgress(Math.round((event.loaded / event.total) * 100));
      }
    }),
    []
  );

  const reset = () => setProgress(0);

  return {
    progress,
    config,
    reset
  };
}

export default useUploadProgress;