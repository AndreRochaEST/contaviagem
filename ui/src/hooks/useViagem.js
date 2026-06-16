import { useState, useEffect } from 'react';
import { callService } from '../utils';


export function useViagem() {
  const [viagens, setViagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarViagens = async () => {
    try {
      setLoading(true);
      const data = await callService({ url: '/viagem', method: 'GET' });
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
    return callService({ url: '/viagem', method: 'POST', data: viagem });
  };

  const atualizarViagem = async (viagem) => {
    return callService({ url: '/viagem', method: 'PUT', data: viagem });
  };

  const apagarViagem = async (uid) => {
    return callService({ url: `/viagem?uid=${uid}`, method: 'DELETE' });
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
