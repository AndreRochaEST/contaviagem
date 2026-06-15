import { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

export function useViagens() {
  const [viagens, setViagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarViagens = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getViagens();
      setViagens(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar viagens:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarViagens();
  }, []);

  const criarViagem = async (viagem) => {
    try {
      const resposta = await apiClient.criarViagem(viagem);
      if (resposta.sucesso) {
        await carregarViagens();
        return resposta;
      }
      throw new Error(resposta.erro || 'Erro ao criar viagem');
    } catch (err) {
      throw err;
    }
  };

  const atualizarViagem = async (viagem) => {
    try {
      const resposta = await apiClient.atualizarViagem(viagem);
      if (resposta.sucesso) {
        await carregarViagens();
        return resposta;
      }
      throw new Error(resposta.erro || 'Erro ao atualizar viagem');
    } catch (err) {
      throw err;
    }
  };

  const apagarViagem = async (uid) => {
    try {
      const resposta = await apiClient.apagarViagem(uid);
      if (resposta.sucesso) {
        await carregarViagens();
        return resposta;
      }
      throw new Error(resposta.erro || 'Erro ao apagar viagem');
    } catch (err) {
      throw err;
    }
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
