import { useState, useEffect, useCallback } from 'react';
import { callService } from '../utils';

export function useTarefa(viagemId) {
  const [tarefas, setTarefas] = useState([]);

  const carregarTarefas = useCallback(async () => {
    if (!viagemId) return;
    const result = await callService({ url: `/tarefa?viagem_id=${viagemId}`, method: 'GET' });
    if (result && result.sucesso) {
      setTarefas(result.data || []);
    }
  }, [viagemId]);

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