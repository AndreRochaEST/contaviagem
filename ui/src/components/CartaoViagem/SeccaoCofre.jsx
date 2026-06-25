import React, { useState, useRef } from 'react';
import { useDocumento, useToast } from '../../hooks';
import { MENSAGENS } from '../../utils';

const SeccaoCofre = ({ mostrarCofre, setMostrarCofre, setMostrarMembros, setMostrarAcertos, setMostrarChecklist, setMostrarItinerario, setMostrarMapa, viagemId }) => {
  const [nome, setNome] = useState('');
  const [nomeFicheiro, setNomeFicheiro] = useState('');
  const [ficheiroBase64, setFicheiroBase64] = useState('');
  const fileInputRef = useRef(null);

  const { documentos, criarDocumento, apagarDocumento, carregarDocumentos } = useDocumento(viagemId);
  const { mostrarErro } = useToast();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFicheiroBase64(reader.result);
        setNomeFicheiro(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async () => {
    if (!nome || !ficheiroBase64) return;
    const result = await criarDocumento({
      viagem_id: parseInt(viagemId),
      nome: nome,
      nome_ficheiro: nomeFicheiro,
      ficheiro: ficheiroBase64
    });
    if (result.sucesso) {
      setNome('');
      setNomeFicheiro('');
      setFicheiroBase64('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      carregarDocumentos();
    } else {
      mostrarErro(MENSAGENS.ERRO_SERVIDOR);
    }
  };

  const handleDelete = async (uid) => {
    const result = await apagarDocumento(uid);
    if (result.sucesso) carregarDocumentos();
  };

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
        }}
      >
        <span>🗄️ Cofre de Viagem ({documentos.length})</span>
        <span>{mostrarCofre ? '▲' : '▼'}</span>
      </button>

      {mostrarCofre && (
        <div className="card-viagem__membros-content">
          <div className="card-viagem__checklist-lista" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            {documentos.length === 0 && <span className="card-viagem__membro-vazio">Nenhum documento guardado.</span>}
            {documentos.map(d => (
              <div key={d.uid} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #10b981', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.95rem' }}>{d.nome}</span>
                  <a href={d.ficheiro} download={d.nome_ficheiro} style={{ fontSize: '0.8rem', color: '#10b981', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}>
                    📄 Transferir: {d.nome_ficheiro}
                  </a>
                </div>
                <button className="card-viagem__membro-remove" onClick={() => handleDelete(d.uid)} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>✖</button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>Guardar Documento</span>
            <input type="text" className="card-viagem__membros-input" placeholder="Título (ex: Bilhete de Avião)" value={nome} onChange={e => setNome(e.target.value)} style={{ backgroundColor: '#fff' }} />
            <input type="file" className="card-viagem__membros-input" ref={fileInputRef} onChange={handleFileChange} style={{ backgroundColor: '#fff', padding: '6px' }} />
            <button type="button" className="card-viagem__membros-btn" onClick={handleAdd} style={{ width: '100%', borderRadius: '6px', padding: '10px', marginTop: '4px', fontWeight: '600', backgroundColor: '#10b981', border: 'none', color: '#fff', cursor: 'pointer' }}>Anexar ao Cofre</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeccaoCofre;