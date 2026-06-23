import React, { useState } from 'react';
import { useItinerario, useToast } from '../../hooks';
import { MENSAGENS } from '../../utils';

const SeccaoItinerario = ({ mostrarItinerario, setMostrarItinerario, setMostrarMembros, setMostrarAcertos, setMostrarChecklist, viagemId }) => {
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [local, setLocal] = useState('');
  const [notas, setNotas] = useState('');

  const { itinerarios, criarItinerario, apagarItinerario, carregarItinerarios } = useItinerario(viagemId);
  const { mostrarErro } = useToast();

  const handleAdd = async () => {
    if (!data || !hora || !local) return;
    const result = await criarItinerario({
      viagem_id: parseInt(viagemId),
      data: data,
      hora: hora,
      local: local,
      notas: notas
    });
    if (result.sucesso) {
      setData('');
      setHora('');
      setLocal('');
      setNotas('');
      carregarItinerarios();
    } else {
      mostrarErro(MENSAGENS.ERRO_SERVIDOR);
    }
  };

  const handleDelete = async (uid) => {
    const result = await apagarItinerario(uid);
    if (result.sucesso) carregarItinerarios();
  };

  const itinerariosOrdenados = [...itinerarios].sort((a, b) => {
    const valA = a.data_hora || '';
    const valB = b.data_hora || '';
    if (!valA && !valB) return 0;
    if (!valA) return 1;
    if (!valB) return -1;
    const dateA = new Date(valA.replace(' ', 'T'));
    const dateB = new Date(valB.replace(' ', 'T'));
    return dateA - dateB;
  });

  const getDisplayDataHora = (item) => {
    const val = item.data_hora || '';
    if (!val) return 'Sem data definida';
    return val.substring(0, 16).replace(' ', ' às ');
  };

  return (
    <div className="card-viagem__membros-container" style={{ marginTop: '-10px' }}>
      <button
        type="button"
        className="card-viagem__membros-toggle"
        onClick={() => {
          setMostrarItinerario(!mostrarItinerario);
          setMostrarMembros(false);
          setMostrarAcertos(false);
          setMostrarChecklist(false);
        }}
      >
        <span>📍 Itinerário ({itinerarios.length})</span>
        <span>{mostrarItinerario ? '▲' : '▼'}</span>
      </button>

      {mostrarItinerario && (
        <div className="card-viagem__membros-content">
          <div className="card-viagem__checklist-lista" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            {itinerariosOrdenados.length === 0 && <span className="card-viagem__membro-vazio">Nenhum local no itinerário.</span>}
            {itinerariosOrdenados.map(i => (
              <div key={i.uid} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 'bold', color: '#334155', fontSize: '0.95rem' }}>{i.local}</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{getDisplayDataHora(i)}</span>
                  {i.notas && <span style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>{i.notas}</span>}
                </div>
                <button className="card-viagem__membro-remove" onClick={() => handleDelete(i.uid)}>✖</button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="date" className="card-viagem__membros-input" value={data} onChange={e => setData(e.target.value)} style={{ flex: 1 }} />
              <input type="time" className="card-viagem__membros-input" value={hora} onChange={e => setHora(e.target.value)} style={{ flex: 1 }} />
            </div>
            <input type="text" className="card-viagem__membros-input" placeholder="Local (ex: Coliseu, Gare du Nord)" value={local} onChange={e => setLocal(e.target.value)} />
            <input type="text" className="card-viagem__membros-input" placeholder="Notas (opcional)" value={notas} onChange={e => setNotas(e.target.value)} />
            <button type="button" className="card-viagem__membros-btn" onClick={handleAdd} style={{ width: '100%', borderRadius: '6px', padding: '8px', marginTop: '4px' }}>Adicionar ao Itinerário</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeccaoItinerario;