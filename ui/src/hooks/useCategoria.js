import { useState, useEffect } from 'react';
import { callService } from '../utils';

export function useCategoria() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarCategorias = async () => {
    try {
      setLoading(true);
      const data = await callService({ url: '/categoria', method: 'GET' });
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
