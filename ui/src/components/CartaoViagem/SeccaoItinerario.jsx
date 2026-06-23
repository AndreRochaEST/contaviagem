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

  const itinerariosAgrupados = itinerariosOrdenados.reduce((acc, item) => {
    const dataStr = item.data_hora ? item.data_hora.substring(0, 10) : 'Sem data';
    if (!acc[dataStr]) acc[dataStr] = [];
    acc[dataStr].push(item);
    return acc;
  }, {});

  const getDisplayHora = (item) => {
    const val = item.data_hora || '';
    if (!val) return '';
    return val.substring(11, 16);
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
          <div className="card-viagem__checklist-lista" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
            {itinerariosOrdenados.length === 0 && <span className="card-viagem__membro-vazio">Nenhum local no itinerário.</span>}
            
            {Object.entries(itinerariosAgrupados).map(([dataStr, itens], index) => (
              <div key={dataStr} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ paddingBottom: '4px', borderBottom: '2px solid #e2e8f0', marginTop: index > 0 ? '8px' : '0' }}>
                  <span style={{ fontWeight: 'bold', color: '#475569', fontSize: '0.95rem' }}>
                    {dataStr === 'Sem data' ? '📌 Sem data definida' : `📅 ${dataStr}`}
                  </span>
                </div>
                
                {itens.map(i => (
                  <div key={i.uid} style={{ display: 'flex', gap: '12px', padding: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6', borderRadius: '8px', position: 'relative', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '1rem' }}>{i.local}</span>
                        <button className="card-viagem__membro-remove" onClick={() => handleDelete(i.uid)} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', padding: '0', lineHeight: '1' }}>✖</button>
                      </div>
                      {getDisplayHora(i) && (
                        <span style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          🕒 {getDisplayHora(i)}
                        </span>
                      )}
                      {i.notas && (
                        <span style={{ fontSize: '0.85rem', color: '#475569', backgroundColor: '#f8fafc', padding: '8px', borderRadius: '6px', border: '1px solid #f1f5f9', marginTop: '2px' }}>
                          📝 {i.notas}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>Adicionar Paragem</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="date" className="card-viagem__membros-input" value={data} onChange={e => setData(e.target.value)} style={{ flex: 1, backgroundColor: '#fff' }} />
              <input type="time" className="card-viagem__membros-input" value={hora} onChange={e => setHora(e.target.value)} style={{ flex: 1, backgroundColor: '#fff' }} />
            </div>
            <input type="text" className="card-viagem__membros-input" placeholder="Local (ex: Coliseu, Gare du Nord)" value={local} onChange={e => setLocal(e.target.value)} style={{ backgroundColor: '#fff' }} />
            <input type="text" className="card-viagem__membros-input" placeholder="Notas (opcional)" value={notas} onChange={e => setNotas(e.target.value)} style={{ backgroundColor: '#fff' }} />
            <button type="button" className="card-viagem__membros-btn" onClick={handleAdd} style={{ width: '100%', borderRadius: '6px', padding: '10px', marginTop: '4px', fontWeight: '600' }}>Adicionar ao Itinerário</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeccaoItinerario;