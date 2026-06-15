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

export function useDespesas() {
  const [despesas, setDespesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarDespesas = async () => {
    try {
      setLoading(true);
      const data = await callService({ url: '/despesas', method: 'GET' });
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
    return callService({ url: '/despesas', method: 'POST', data: despesa });
  };

  const atualizarDespesa = async (despesa) => {
    return callService({ url: '/despesas', method: 'PUT', data: despesa });
  };

  const apagarDespesa = async (uid) => {
    return callService({ url: `/despesas?uid=${uid}`, method: 'DELETE' });
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
