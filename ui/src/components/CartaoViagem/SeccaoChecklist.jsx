import React, { useState } from 'react';

const SeccaoChecklist = ({ 
  mostrarChecklist, 
  setMostrarChecklist, 
  setMostrarMembros, 
  setMostrarAcertos, 
  tarefasDaViagem, 
  onAddTarefa, 
  onToggleTarefa, 
  onDeleteTarefa, 
  viagemId 
}) => {
  const [novoItemTexto, setNovoItemTexto] = useState('');

  const handleAdd = () => {
    if (!novoItemTexto.trim()) return;
    onAddTarefa(viagemId, novoItemTexto.trim());
    setNovoItemTexto('');
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
        <span>🎒 Checklist ({tarefasDaViagem.filter(t => t.feito).length}/{tarefasDaViagem.length})</span>
        <span>{mostrarChecklist ? '▲' : '▼'}</span>
      </button>

      {mostrarChecklist && (
        <div className="card-viagem__membros-content">
          <div className="card-viagem__checklist-lista" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            {tarefasDaViagem.length === 0 && <span className="card-viagem__membro-vazio">Nenhum item na lista de preparação.</span>}
            {tarefasDaViagem.map(t => (
              <div key={t.uid} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  cursor: 'pointer', 
                  fontSize: '0.9rem', 
                  color: t.feito ? '#94a3b8' : '#334155', 
                  textDecoration: t.feito ? 'line-through' : 'none', 
                  userSelect: 'none' 
                }}>
                  <input type="checkbox" checked={t.feito} onChange={() => onToggleTarefa(t.uid, !t.feito)} />
                  {t.texto}
                </label>
                <button className="card-viagem__membro-remove" onClick={() => onDeleteTarefa(t.uid)} title="Remover">✖</button>
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