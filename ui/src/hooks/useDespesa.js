import { useState, useEffect } from 'react';
import { callService } from '../utils';

export function useDespesa() {
  const [despesas, setDespesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarDespesas = async () => {
    try {
      setLoading(true);
      const data = await callService({ url: '/despesa', method: 'GET' });
      setDespesas(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err && err.error ? (err.error.message || String(err.error)) : (err && err.message ? err.message : String(err)));
      console.error('Erro ao carregar despesas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDespesas();
  }, []);

  const criarDespesa = async (despesa) => {
    return callService({ url: '/despesa', method: 'POST', data: despesa });
  };

  const atualizarDespesa = async (despesa) => {
    return callService({ url: '/despesa', method: 'PUT', data: despesa });
  };

  const apagarDespesa = async (uid) => {
    return callService({ url: `/despesa?uid=${uid}`, method: 'DELETE' });
  };

  return {
    despesas,
    loading,
    error,
    carregarDespesas,
    criarDespesa,
    atualizarDespesa,
    apagarDespesa
  };
}
