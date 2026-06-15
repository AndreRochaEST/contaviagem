import { useState, useEffect } from 'react';
import _service from '@netuno/service-client';

const callService = (opts) => new Promise((resolve, reject) => {
  _service({
    ...opts,
    success: (response) => {
      if (response && response.json !== undefined) resolve(response.json);
      else if (response && response.text !== undefined) resolve(response.text);
      else resolve(response);
    },
    fail: (err) => reject(err)
  });
});

export function useCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarCategorias = async () => {
    try {
      setLoading(true);
      const data = await callService({ url: '/categorias', method: 'GET' });
      setCategorias(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err && err.error ? (err.error.message || String(err.error)) : (err && err.message ? err.message : String(err)));
      console.error('Erro ao carregar categorias:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  return {
    categorias,
    loading,
    error,
    carregarCategorias
  };
}
