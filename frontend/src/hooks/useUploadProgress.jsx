import { useState } from 'react';

export function useUploadProgress() {
  const [progress, setProgress] = useState(0);

  const config = {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (evt) => {
      if (!evt.total) return;
      setProgress(Math.round((evt.loaded / evt.total) * 100));
    }
  };

  const reset = () => setProgress(0);

  return { progress, setProgress, reset, config };
}