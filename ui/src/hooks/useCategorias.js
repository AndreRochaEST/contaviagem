import { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

export function useCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarCategorias = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getCategorias();
      setCategorias(data);
      setError(null);
    } catch (err) {
      setError(err.message);
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
