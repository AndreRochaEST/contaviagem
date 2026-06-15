import { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

export function useDespesas() {
  const [despesas, setDespesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarDespesas = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getDespesas();
      setDespesas(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar despesas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDespesas();
  }, []);

  const criarDespesa = async (despesa) => {
    try {
      const resposta = await apiClient.criarDespesa(despesa);
      if (resposta.sucesso) {
        await carregarDespesas();
        return resposta;
      }
      throw new Error(resposta.erro || 'Erro ao criar despesa');
    } catch (err) {
      throw err;
    }
  };

  const atualizarDespesa = async (despesa) => {
    try {
      const resposta = await apiClient.atualizarDespesa(despesa);
      if (resposta.sucesso) {
        await carregarDespesas();
        return resposta;
      }
      throw new Error(resposta.erro || 'Erro ao atualizar despesa');
    } catch (err) {
      throw err;
    }
  };

  const apagarDespesa = async (uid) => {
    try {
      const resposta = await apiClient.apagarDespesa(uid);
      if (resposta.sucesso) {
        await carregarDespesas();
        return resposta;
      }
      throw new Error(resposta.erro || 'Erro ao apagar despesa');
    } catch (err) {
      throw err;
    }
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
