import { useState, useEffect } from 'react';
import { callService } from '../utils';

export function useMembro() {
  const [membros, setMembros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarMembros = async () => {
    try {
      setLoading(true);
      const data = await callService({ url: '/membro', method: 'GET' });
      setMembros(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err && err.error ? (err.error.message || String(err.error)) : (err && err.message ? err.message : String(err)));
      console.error('Erro ao carregar membros:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarMembros();
  }, []);

  const criarMembro = async (membro) => {
    return callService({ url: '/membro', method: 'POST', data: membro });
  };

  const atualizarMembro = async (membro) => {
    return callService({ url: '/membro', method: 'PUT', data: membro });
  };

  const apagarMembro = async (uid) => {
    return callService({ url: `/membro?uid=${uid}`, method: 'DELETE' });
  };

  return {
    membros,
    loading,
    error,
    carregarMembros,
    criarMembro,
    atualizarMembro,
    apagarMembro
  };
}