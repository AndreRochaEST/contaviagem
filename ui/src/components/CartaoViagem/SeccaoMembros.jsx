import React, { useState } from 'react';
import { formatarMoeda } from '../../utils';

const SeccaoMembros = ({ mostrarMembros, setMostrarMembros, setMostrarAcertos, membrosDaViagem, todasDespesasDaViagem, onDeleteMembro, onAddMembro, viagemId }) => {
  const [novoMembroNome, setNovoMembroNome] = useState('');

  const handleAdd = () => {
    if (!novoMembroNome.trim()) return;
    onAddMembro(viagemId, novoMembroNome.trim());
    setNovoMembroNome('');
  };

  return (
    <div className="card-viagem__membros-container">
      <button className="card-viagem__membros-toggle" onClick={() => { setMostrarMembros(!mostrarMembros); setMostrarAcertos(false); }}>
        <span>👥 Participantes ({membrosDaViagem.length})</span>
        <span>{mostrarMembros ? '▲' : '▼'}</span>
      </button>

      {mostrarMembros && (
        <div className="card-viagem__membros-content">
          <div className="card-viagem__membros-lista">
            {membrosDaViagem.length === 0 && <span className="card-viagem__membro-vazio">Nenhum participante adicionado.</span>}
            {membrosDaViagem.map(m => {
              const totalPago = todasDespesasDaViagem.filter(d => String(d.pago_por_id) === String(m.id)).reduce((acc, curr) => acc + curr.valor, 0);
              return (
                <span key={m.uid} className="card-viagem__membro-badge">
                  {m.nome}
                  {totalPago > 0 && <span style={{ color: '#16a34a', fontWeight: 'bold', marginLeft: '4px' }}>({formatarMoeda(totalPago)})</span>}
                  <button className="card-viagem__membro-remove" onClick={() => onDeleteMembro(m.uid)} title="Remover">✖</button>
                </span>
              );
            })}
          </div>
          <div className="card-viagem__membros-add">
            <input type="text" className="card-viagem__membros-input" placeholder="Adicionar nome..." value={novoMembroNome} onChange={e => setNovoMembroNome(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} />
            <button className="card-viagem__membros-btn" onClick={handleAdd}>+</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeccaoMembros;