import React, { useState } from 'react';
import { useTarefa, useToast } from '../../hooks';
import { MENSAGENS } from '../../utils';

const SeccaoChecklist = ({ mostrarChecklist, setMostrarChecklist, setMostrarMembros, setMostrarAcertos, viagemId }) => {
  const [novoItemTexto, setNovoItemTexto] = useState('');
  
  const { tarefas, carregarTarefas, criarTarefa, atualizarTarefa, apagarTarefa } = useTarefa(viagemId);
  const { mostrarErro } = useToast();

  const handleAdd = async () => {
    if (!novoItemTexto.trim()) return;
    const result = await criarTarefa({ viagem_id: parseInt(viagemId), texto: novoItemTexto.trim(), feito: false });
    if (result.sucesso) {
      setNovoItemTexto('');
      carregarTarefas();
    } else {
      mostrarErro(MENSAGENS.ERRO_SERVIDOR);
    }
  };

  const handleToggle = async (uid, feito) => {
    const result = await atualizarTarefa({ uid, feito });
    if (result.sucesso) carregarTarefas();
  };

  const handleDelete = async (uid) => {
    const result = await apagarTarefa(uid);
    if (result.sucesso) carregarTarefas();
  };

  return (
    <div className="card-viagem__membros-container" style={{ marginTop: '-10px' }}>
      <button 
        type="button"
        className="card-viagem__membros-toggle" 
        onClick={() => { 
          setMostrarChecklist(!mostrarChecklist); 
          setMostrarMembros(false); 
          setMostrarAcertos(false); 
        }}
      >
        <span>🎒 Checklist ({tarefas.filter(t => t.feito).length}/{tarefas.length})</span>
        <span>{mostrarChecklist ? '▲' : '▼'}</span>
      </button>

      {mostrarChecklist && (
        <div className="card-viagem__membros-content">
          <div className="card-viagem__checklist-lista" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            {tarefas.length === 0 && <span className="card-viagem__membro-vazio">Nenhum item na lista de preparação.</span>}
            {tarefas.map(t => (
              <div key={t.uid} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: t.feito ? '#94a3b8' : '#334155', textDecoration: t.feito ? 'line-through' : 'none', userSelect: 'none' }}>
                  <input type="checkbox" checked={t.feito} onChange={() => handleToggle(t.uid, !t.feito)} />
                  {t.texto}
                </label>
                <button className="card-viagem__membro-remove" onClick={() => handleDelete(t.uid)} title="Remover">✖</button>
              </div>
            ))}
          </div>
          <div className="card-viagem__membros-add">
            <input 
              type="text" 
              className="card-viagem__membros-input" 
              placeholder="Ex: Protetor solar, Reservar cacifo..." 
              value={novoItemTexto} 
              onChange={e => setNovoItemTexto(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleAdd()} 
            />
            <button type="button" className="card-viagem__membros-btn" onClick={handleAdd}>+</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeccaoChecklist;