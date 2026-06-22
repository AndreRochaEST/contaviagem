import { useState, useEffect, useCallback } from 'react';
import { callService } from '../utils';

export function useTarefa() {
  const [tarefas, setTarefas] = useState([]);

  const carregarTarefas = useCallback(async () => {
    const result = await callService({ url: '/tarefa', method: 'GET' });
    if (result && result.sucesso) {
      setTarefas(result.data || []);
    }
  }, []);

  useEffect(() => {
    carregarTarefas();
  }, [carregarTarefas]);

  const criarTarefa = async (dados) => {
    return await callService({ url: '/tarefa', method: 'POST', data: dados });
  };

  const atualizarTarefa = async (dados) => {
    return await callService({ url: '/tarefa', method: 'PUT', data: dados });
  };

  const apagarTarefa = async (uid) => {
    return await callService({ url: '/tarefa', method: 'DELETE', data: { uid } });
  };

  return { tarefas, carregarTarefas, criarTarefa, atualizarTarefa, apagarTarefa };
}