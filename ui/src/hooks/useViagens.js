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

export function useViagens() {
  const [viagens, setViagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarViagens = async () => {
    try {
      setLoading(true);
      const data = await callService({ url: '/viagens', method: 'GET' });
      setViagens(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err && err.error ? (err.error.message || String(err.error)) : (err && err.message ? err.message : String(err)));
      console.error('Erro ao carregar viagens:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarViagens();
  }, []);

  const criarViagem = async (viagem) => {
    return callService({ url: '/viagens', method: 'POST', data: viagem });
  };

  const atualizarViagem = async (viagem) => {
    return callService({ url: '/viagens', method: 'PUT', data: viagem });
  };

  const apagarViagem = async (uid) => {
    return callService({ url: `/viagens?uid=${uid}`, method: 'DELETE' });
  };

  return {
    viagens,
    loading,
    error,
    carregarViagens,
    criarViagem,
    atualizarViagem,
    apagarViagem
  };
}
