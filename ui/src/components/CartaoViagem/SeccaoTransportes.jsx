import React, { useState } from 'react';
import { useTransporte, useToast } from '../../hooks';
import { MENSAGENS } from '../../utils';
import { detetarTemposMortos } from '../../utils/calculations';

const SeccaoTransportes = ({ 
  mostrarTransportes, setMostrarTransportes, setMostrarMembros, setMostrarAcertos, 
  setMostrarChecklist, setMostrarItinerario, setMostrarMapa, setMostrarCofre, viagemId 
}) => {
  const [editUid, setEditUid] = useState(null);
  const [operadora, setOperadora] = useState('');
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [partida, setPartida] = useState('');
  const [lugar, setLugar] = useState('');

  const { transportes, criarTransporte, atualizarTransporte, apagarTransporte, carregarTransportes } = useTransporte(viagemId);
  const { mostrarErro, mostrarSucesso } = useToast();

  const iniciarEdicao = (transporte) => {
    setEditUid(transporte.uid);
    setOperadora(transporte.operadora || '');
    setOrigem(transporte.origem || '');
    setDestino(transporte.destino || '');
    if (transporte.partida) {
      const partidaStr = transporte.partida.replace(' ', 'T').substring(0, 16);
      setPartida(partidaStr);
    } else {
      setPartida('');
    }
    setLugar(transporte.lugar || '');
  };

  const cancelarEdicao = () => {
    setEditUid(null);
    setOperadora('');
    setOrigem('');
    setDestino('');
    setPartida('');
    setLugar('');
  };

  const handleSubmit = async () => {
    if (!operadora || !origem || !destino) {
      mostrarErro('Preenche a operadora, origem e destino.');
      return;
    }

    const dados = {
      viagem_id: parseInt(viagemId),
      operadora,
      origem,
      destino,
      partida,
      lugar
    };

    let result;
    if (editUid) {
      dados.uid = editUid;
      result = await atualizarTransporte(dados);
    } else {
      result = await criarTransporte(dados);
    }

    if (result && result.sucesso) {
      mostrarSucesso(editUid ? 'Transporte atualizado!' : 'Transporte adicionado!');
      cancelarEdicao();
      carregarTransportes();
    } else {
      mostrarErro(result?.erro || MENSAGENS.ERRO_SERVIDOR);
    }
  };

  const handleDelete = async (uid) => {
    if (!window.confirm('Queres mesmo apagar este transporte?')) return;
    const result = await apagarTransporte(uid);
    if (result && result.sucesso) {
      mostrarSucesso('Transporte removido.');
      carregarTransportes();
    } else {
      mostrarErro(result?.erro || MENSAGENS.ERRO_SERVIDOR);
    }
  };

  const transportesOrdenados = [...transportes].sort((a, b) => new Date(a.partida || '9999') - new Date(b.partida || '9999'));
  const alertas = detetarTemposMortos(transportes);

  return (
    <div className="card-viagem__membros-container" style={{ marginTop: '-10px' }}>
      <button
        type="button"
        className="card-viagem__membros-toggle"
        onClick={() => {
          setMostrarTransportes(!mostrarTransportes);
          setMostrarMembros(false); setMostrarAcertos(false); setMostrarChecklist(false);
          setMostrarItinerario(false); setMostrarMapa(false); setMostrarCofre(false);
        }}
      >
        <span>🚆 Ligações e Transportes ({transportes.length})</span>
        <span>{mostrarTransportes ? '▲' : '▼'}</span>
      </button>

      {mostrarTransportes && (
        <div className="card-viagem__membros-content">
          <div className="card-viagem__checklist-lista" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            {transportes.length === 0 && <span className="card-viagem__membro-vazio">Nenhuma ligação registada.</span>}
            {transportesOrdenados.map((t, index) => {
              const alerta = alertas.find(a => a.index === index);
              return (
                <React.Fragment key={t.uid}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '14px', 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0', 
                    borderLeft: '4px solid #f59e0b', 
                    borderRadius: '8px', 
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)' 
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1.05rem' }}>{t.operadora}</span>
                        {t.lugar && <span style={{ fontSize: '0.9rem', color: '#f59e0b', fontWeight: '700', backgroundColor: '#fef3c7', padding: '2px 8px', borderRadius: '4px' }}>Lugar {t.lugar}</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '0.95rem', fontWeight: '500' }}>
                        <span>{t.origem}</span> <span style={{ color: '#cbd5e1' }}>➔</span> <span>{t.destino}</span>
                      </div>
                      {t.partida && <span style={{ fontSize: '0.85rem', color: '#64748b' }}>🕒 Partida: {t.partida.replace('T', ' às ')}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button 
                        onClick={() => iniciarEdicao(t)} 
                        style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', padding: '0' }}
                        title="Editar transporte"
                      >
                        ✏️
                      </button>
                      <button 
                        className="card-viagem__membro-remove" 
                        onClick={() => handleDelete(t.uid)} 
                        style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0' }}
                      >
                        ✖
                      </button>
                    </div>
                  </div>
                  {alerta && (
                    <div style={{ padding: '10px 14px', backgroundColor: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px', color: '#d46b08', fontSize: '0.9rem' }}>
                      <span>⏱️</span> <strong>Tempo Morto:</strong> {alerta.horas}h em {alerta.destino}. Sugestão: Cacifos!
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
              {editUid ? '✏️ Editar Transporte' : 'Registar Transporte'}
            </span>
            <input 
              type="text" 
              className="card-viagem__membros-input" 
              placeholder="Operadora (ex: Iryo, TAP, FlixBus)" 
              value={operadora} 
              onChange={e => setOperadora(e.target.value)} 
              style={{ backgroundColor: '#fff' }} 
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                className="card-viagem__membros-input" 
                placeholder="Origem" 
                value={origem} 
                onChange={e => setOrigem(e.target.value)} 
                style={{ flex: 1, backgroundColor: '#fff' }} 
              />
              <input 
                type="text" 
                className="card-viagem__membros-input" 
                placeholder="Destino" 
                value={destino} 
                onChange={e => setDestino(e.target.value)} 
                style={{ flex: 1, backgroundColor: '#fff' }} 
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="datetime-local" 
                className="card-viagem__membros-input" 
                value={partida} 
                onChange={e => setPartida(e.target.value)} 
                style={{ flex: 2, backgroundColor: '#fff' }} 
              />
              <input 
                type="text" 
                className="card-viagem__membros-input" 
                placeholder="Lugar (Opcional)" 
                value={lugar} 
                onChange={e => setLugar(e.target.value)} 
                style={{ flex: 1, backgroundColor: '#fff' }} 
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                type="button" 
                className="card-viagem__membros-btn" 
                onClick={handleSubmit} 
                style={{ 
                  width: '100%', 
                  borderRadius: '6px', 
                  padding: '10px', 
                  marginTop: '4px', 
                  fontWeight: '600', 
                  backgroundColor: editUid ? '#f59e0b' : '#f59e0b', 
                  border: 'none', 
                  color: '#fff', 
                  cursor: 'pointer' 
                }}
              >
                {editUid ? 'Atualizar Transporte' : 'Adicionar Transporte'}
              </button>
              {editUid && (
                <button 
                  type="button" 
                  onClick={cancelarEdicao} 
                  style={{ 
                    padding: '10px 16px', 
                    borderRadius: '6px', 
                    border: '1px solid #cbd5e1', 
                    background: '#fff', 
                    color: '#475569', 
                    cursor: 'pointer', 
                    fontWeight: '600' 
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeccaoTransportes;