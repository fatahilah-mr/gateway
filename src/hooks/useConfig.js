import { useState, useEffect } from 'react';

export function useConfig() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch('/content/config.json')
      .then(r => {
        if (!r.ok) {
          throw new Error('Failed to fetch config');
        }
        return r.json();
      })
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err);
        setLoading(false);
      });
  }, []);
  
  return { config, loading, error };
}
