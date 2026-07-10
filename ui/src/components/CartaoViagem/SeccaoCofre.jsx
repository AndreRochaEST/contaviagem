import React, { useState, useEffect, useCallback } from 'react';
import { callService, formatarMoeda } from '../../utils';
import { useToast } from '../../hooks';
import CryptoJS from 'crypto-js';

const CHAVE_SECRETA = 'viagem_segura_aes_256'; 

const SeccaoCofre = ({ 
  mostrarCofre, setMostrarCofre, setMostrarMembros, setMostrarAcertos, 
  setMostrarChecklist, setMostrarItinerario, setMostrarMapa, setMostrarTransportes, 
  viagemId, membros = []
}) => {
  const [abaInterna, setAbaInterna] = useState('bilhetes');
  
  const [bilhetes, setBilhetes] = useState([]);
  const [novoBilhete, setNovoBilhete] = useState('');
  const [ficheiroBilhete, setFicheiroBilhete] = useState(null);

  const [contribuicoes, setContribuicoes] = useState([]);
  const [totalContribuido, setTotalContribuido] = useState(0);
  const [saldoDisponivel, setSaldoDisponivel] = useState(0);
  const [membroSelecionado, setMembroSelecionado] = useState('');
  const [valorDeposito, setValorDeposito] = useState('');
  
  const { mostrarSucesso, mostrarErro } = useToast();

  const carregarDadosCofre = useCallback(async () => {
    if (!viagemId) return;
    try {
      const result = await callService({ url: `/cofre?viagem_id=${viagemId}`, method: 'GET' });
      if (result && result.sucesso) {
        setContribuicoes(result.contribuicoes || []);
        setTotalContribuido(result.totalContribuido || 0);
        setSaldoDisponivel(result.saldoDisponivel || 0);
      }
      
      const resultBilhetes = await callService({ url: `/documento?viagem_id=${viagemId}`, method: 'GET' });
      if (resultBilhetes && resultBilhetes.sucesso) {
        setBilhetes(resultBilhetes.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  }, [viagemId]);

  useEffect(() => {
    if (mostrarCofre) {
      carregarDadosCofre();
    }
  }, [mostrarCofre, carregarDadosCofre]);

  const handleAddBilhete = async () => {
    if (!novoBilhete) {
      mostrarErro('Dá um nome ao teu documento.');
      return;
    }
    if (!ficheiroBilhete) {
      mostrarErro('Tens de selecionar um ficheiro.');
      return;
    }

    try {
      const reader = new FileReader();
      reader.readAsDataURL(ficheiroBilhete);
      reader.onload = async () => {
        const base64String = reader.result;
        const ficheiroEncriptado = CryptoJS.AES.encrypt(base64String, CHAVE_SECRETA).toString();

        const result = await callService({
          url: '/documento',
          method: 'POST',
          data: {
            viagem_id: parseInt(viagemId),
            nome: novoBilhete,
            nome_ficheiro: ficheiroBilhete.name,
            ficheiro: ficheiroEncriptado
          }
        });

        if (result && result.sucesso) {
          setNovoBilhete('');
          setFicheiroBilhete(null);
          const fileInput = document.getElementById('input-ficheiro-bilhete');
          if (fileInput) fileInput.value = '';
          
          carregarDadosCofre();
          mostrarSucesso('Documento encriptado e guardado!');
        } else {
          mostrarErro('Erro ao guardar documento.');
        }
      };
    } catch (error) {
      mostrarErro('Erro ao encriptar ficheiro.');
    }
  };

  const abrirFicheiro = (ficheiroHash) => {
    try {
      if (ficheiroHash && ficheiroHash.startsWith('U2Fsd')) {
        const bytes = CryptoJS.AES.decrypt(ficheiroHash, CHAVE_SECRETA);
        const base64Decifrado = bytes.toString(CryptoJS.enc.Utf8);
        
        if (base64Decifrado) {
          const win = window.open();
          win.document.write(`<iframe src="${base64Decifrado}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
          return;
        }
      }
      window.open(`http://localhost:9000/${ficheiroHash}`, '_blank');
    } catch (error) {
      mostrarErro('Erro ao desencriptar. Verifica a chave secreta.');
    }
  };

  const handleDeleteBilhete = async (uid) => {
    try {
      const result = await callService({ url: '/documento', method: 'DELETE', data: { uid } });
      if (result && result.sucesso) {
        carregarDadosCofre();
        mostrarSucesso('Documento removido.');
      }
    } catch (error) {
      mostrarErro('Erro de comunicação.');
    }
  };

  const handleAddDeposito = async () => {
    if (!membroSelecionado || !valorDeposito || parseFloat(valorDeposito) <= 0) return;
    try {
      const result = await callService({
        url: '/cofre',
        method: 'POST',
        data: {
          viagem_id: parseInt(viagemId),
          membro_id: parseInt(membroSelecionado),
          valor: parseFloat(valorDeposito)
        }
      });
      if (result && result.sucesso) {
        setValorDeposito('');
        setMembroSelecionado('');
        carregarDadosCofre();
        mostrarSucesso('Depósito registado no cofre!');
      }
    } catch (error) {
      mostrarErro('Erro de comunicação.');
    }
  };

  const handleDeleteDeposito = async (uid) => {
    try {
      const result = await callService({ url: '/cofre', method: 'DELETE', data: { uid } });
      if (result && result.sucesso) {
        carregarDadosCofre();
        mostrarSucesso('Depósito removido.');
      }
    } catch (error) {
      mostrarErro('Erro de comunicação.');
    }
  };

  const membrosDaViagem = membros.filter(m => m.viagem_id === viagemId);

  return (
    <div className="card-viagem__membros-container" style={{ marginTop: '-10px' }}>
      <button
        type="button"
        className="card-viagem__membros-toggle"
        onClick={() => {
          setMostrarCofre(!mostrarCofre);
          setMostrarMembros(false);
          setMostrarAcertos(false);
          setMostrarChecklist(false);
          setMostrarItinerario(false);
          setMostrarMapa(false);
          setMostrarTransportes(false);
        }}
      >
        <span>💰 Cofre de Viagem</span>
        <span>{mostrarCofre ? '▲' : '▼'}</span>
      </button>

      {mostrarCofre && (
        <div className="card-viagem__membros-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px' }}>
            <button 
              type="button"
              onClick={() => setAbaInterna('bilhetes')}
              style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', fontWeight: '700', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer', backgroundColor: abaInterna === 'bilhetes' ? '#3b82f6' : '#fff', color: abaInterna === 'bilhetes' ? '#fff' : '#475569', transition: 'all 0.2s', boxShadow: abaInterna === 'bilhetes' ? '0 2px 4px rgba(59,130,246,0.3)' : 'none' }}
            >
              🎫 Bilhetes Anexos
            </button>
            <button 
              type="button"
              onClick={() => setAbaInterna('financeiro')}
              style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', fontWeight: '700', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer', backgroundColor: abaInterna === 'financeiro' ? '#3b82f6' : '#fff', color: abaInterna === 'financeiro' ? '#fff' : '#475569', transition: 'all 0.2s', boxShadow: abaInterna === 'financeiro' ? '0 2px 4px rgba(59,130,246,0.3)' : 'none' }}
            >
              🪙 Fundo Comum
            </button>
          </div>

          {abaInterna === 'bilhetes' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {bilhetes.length === 0 && <span className="card-viagem__membro-vazio">Nenhum bilhete guardado no cofre.</span>}
                {bilhetes.map(b => (
                  <div key={b.uid} style={{ padding: '14px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.2rem' }}>🔖</span>
                        <strong style={{ color: '#1e293b', fontSize: '1rem' }}>{b.nome}</strong>
                      </div>
                      <button 
                        onClick={() => handleDeleteBilhete(b.uid)} 
                        style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0', lineHeight: '1', transition: 'color 0.2s' }}
                        onMouseOver={e => e.target.style.color = '#ef4444'} 
                        onMouseOut={e => e.target.style.color = '#94a3b8'}
                      >
                        ✖
                      </button>
                    </div>

                    {b.ficheiro && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f0f9ff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                          <span style={{ fontSize: '1.1rem' }}>📎</span>
                          <span style={{ fontSize: '0.85rem', color: '#0369a1', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                            {b.nome_ficheiro || 'Documento anexo'}
                          </span>
                        </div>
                        <button 
                          onClick={() => abrirFicheiro(b.ficheiro)}
                          style={{ backgroundColor: '#0284c7', color: '#fff', fontSize: '0.75rem', padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', boxShadow: '0 1px 2px rgba(2,132,199,0.3)' }}
                        >
                          Abrir
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Guardar Novo Documento Seguro</span>
                
                <input 
                  type="text" 
                  className="card-viagem__membros-input" 
                  placeholder="Nome (ex: Cartões de Embarque)" 
                  value={novoBilhete} 
                  onChange={e => setNovoBilhete(e.target.value)}
                  style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
                
                <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '6px', border: '1px dashed #94a3b8' }}>
                  <input 
                    id="input-ficheiro-bilhete"
                    type="file" 
                    onChange={e => setFicheiroBilhete(e.target.files[0])}
                    style={{ fontSize: '0.85rem', color: '#475569', width: '100%', cursor: 'pointer' }}
                  />
                </div>
                
                <button 
                  type="button" 
                  onClick={handleAddBilhete} 
                  style={{ width: '100%', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem', marginTop: '4px', boxShadow: '0 2px 4px rgba(59,130,246,0.3)' }}
                >
                  🔒 Guardar
                </button>
              </div>
            </>
          )}

          {abaInterna === 'financeiro' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>ARRECADADO</span>
                  <strong style={{ fontSize: '1.2rem', color: '#1e293b' }}>{formatarMoeda(totalContribuido)}</strong>
                </div>
                <div style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center', backgroundColor: saldoDisponivel < 0 ? '#fef2f2' : '#f0fdf4', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>SALDO DISPONÍVEL</span>
                  <strong style={{ fontSize: '1.2rem', color: saldoDisponivel < 0 ? '#ef4444' : '#22c55e' }}>{formatarMoeda(saldoDisponivel)}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {contribuicoes.length === 0 && <span className="card-viagem__membro-vazio">Nenhum depósito efetuado no cofre.</span>}
                {contribuicoes.map(c => (
                  <div key={c.uid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <span style={{ fontWeight: '600', color: '#334155', fontSize: '0.9rem' }}>{c.membro}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>+{formatarMoeda(c.valor)}</strong>
                      <button 
                        onClick={() => handleDeleteDeposito(c.uid)} 
                        style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', padding: '0', transition: 'color 0.2s' }}
                        onMouseOver={e => e.target.style.color = '#ef4444'} 
                        onMouseOut={e => e.target.style.color = '#94a3b8'}
                      >
                        ✖
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Registar Depósito</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select 
                    value={membroSelecionado} 
                    onChange={e => setMembroSelecionado(e.target.value)} 
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '0.9rem', color: '#1e293b' }}
                  >
                    <option value="">Quem deposita?</option>
                    {membrosDaViagem.map(m => (
                      <option key={m.id} value={m.id}>{m.nome}</option>
                    ))}
                  </select>
                  <input 
                    type="number" 
                    placeholder="Valor (€)" 
                    value={valorDeposito} 
                    onChange={e => setValorDeposito(e.target.value)} 
                    style={{ width: '100px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '0.9rem' }}
                  />
                </div>
                <button 
                  type="button" 
                  onClick={handleAddDeposito} 
                  style={{ width: '100%', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem', marginTop: '4px', boxShadow: '0 2px 4px rgba(16,185,129,0.3)' }}
                >
                  Confirmar Depósito
                </button>
              </div>
            </>
          )}

        </div>
      )}
    </div>
  );
};

export default SeccaoCofre;