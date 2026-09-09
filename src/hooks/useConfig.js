import { useState, useEffect, useCallback } from 'react';
import defaultConfig from '../data/defaultConfig.json';

export function useConfig() {
  const [config, setConfig] = useState(defaultConfig);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchConfig = useCallback(async () => {
    try {
      // 1. Fetch from dynamic D1 API (Edge cached by Cloudflare CDN to absorb traffic surges)
      const response = await fetch('/api/data', {
        headers: {
          'Accept': 'application/json'
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
              id: typeof link.id === 'string' ? link.id : link.url,
              url: link.url,
              icon: link.icon,
              is_highlight: link.is_highlight,
              click_count: link.click_count || 0,
              en_title: link.en_title || link.en?.title || '',
              en_description: link.en_description || link.en?.description || '',
              id_title: link.id_title || link.id_lang?.title || '',
              id_description: link.id_description || link.id_lang?.description || ''
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
