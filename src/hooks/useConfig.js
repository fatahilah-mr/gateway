import { useState, useEffect, useCallback } from 'react';

export function useConfig() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConfig = useCallback(async () => {
    try {
      // 1. Fetch from dynamic D1 API with strict anti-cache
      const response = await fetch('/api/data', {
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.config && data.links) {
          const formattedConfig = {
            name: data.config.name,
            short_name: data.config.shortName,
            en: data.config.en,
            id: data.config.id,
            links: data.links.map(link => ({
              id: link.id,
              url: link.url,
              icon: link.icon,
              is_highlight: link.is_highlight,
              click_count: link.click_count || 0,
              en_title: link.en?.title || '',
              en_description: link.en?.description || '',
              id_title: link.id?.title || '',
              id_description: link.id?.description || ''
            }))
          };
          setConfig(formattedConfig);
          setLoading(false);
          return;
        }
      }

      // 2. Fallback to static config.json if /api/data fails
      const fallbackResponse = await fetch('/content/config.json');
      if (!fallbackResponse.ok) {
        throw new Error(`Failed to fetch fallback config: ${fallbackResponse.statusText}`);
      }
      const fallbackData = await fallbackResponse.json();
      setConfig(fallbackData);
      setLoading(false);
    } catch (err) {
      console.warn('Primary /api/data fetch failed, trying static fallback...', err);
      try {
        const fallback = await fetch('/content/config.json');
        const fallbackJson = await fallback.json();
        setConfig(fallbackJson);
      } catch (fallbackErr) {
        console.error('All config fetches failed:', fallbackErr);
        setError(fallbackErr);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return { config, loading, error, refresh: fetchConfig };
}
