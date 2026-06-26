import React from 'react';
import './index.less';
import SeccaoCambio from './SeccaoCambio';
import SeccaoEnvolvidos from './SeccaoEnvolvidos';

const SeccaoDivisaoExata = ({ membrosDaViagem, divisaoExata = {}, onChange, valorTotal }) => {
  const handleValorChange = (membroId, valorDigitado) => {
    const novaDivisao = { ...divisaoExata };
    if (valorDigitado === '' || parseFloat(valorDigitado) === 0) {
      delete novaDivisao[membroId];
    } else {
      novaDivisao[membroId] = parseFloat(valorDigitado);
    }
    onChange('divisaoExata', novaDivisao);
  };

  const somaAtual = Object.values(divisaoExata).reduce((acc, val) => acc + (val || 0), 0);
  const diferenca = parseFloat(valorTotal || 0) - somaAtual;
  const saldoCorreto = Math.abs(diferenca) < 0.01;

  return (
    <div className="form-despesa__divisao-exata" style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
      <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#334155' }}>Valores Consumidos por Pessoa</h4>
      
      {membrosDaViagem.map(m => (
        <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.9rem', color: '#475569' }}>{m.nome}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="number"
              step="0.01"
              min="0"
              style={{ width: '80px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              placeholder="0.00"
              value={divisaoExata[m.id] || ''}
              onChange={(e) => handleValorChange(m.id, e.target.value)}
            />
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>€</span>
          </div>
        </div>
      ))}
      
      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
        <span style={{ fontWeight: '600', color: '#334155' }}>Total: {somaAtual.toFixed(2)}€</span>
        <span style={{ fontWeight: '700', color: saldoCorreto ? '#16a34a' : '#dc2626' }}>
          {saldoCorreto ? '✓ Fechado' : `Falta: ${diferenca.toFixed(2)}€`}
        </span>
      </div>
    </div>
  );
};

function FormDespesa({ 
  editando, descricao, valor, viagemId, categoriaId, membroId, etapa, envolvidosIds = [],
  usarCambio, moeda, valorEstrangeiro, taxaCambio,
  usarDivisaoExata, divisaoExata,
  viagens, categorias, membros, etapasDaViagem,
  onChange, onSubmit 
}) {
  
  const membrosDaViagem = membros ? membros.filter(m => m.viagem_id == viagemId) : [];

  return (
    <div className="form-container panel-animado form-despesa">
      <h3 className="form-despesa__title">{editando ? '✏️ Atualizar Gasto' : '+ Detalhes do Gasto'}</h3>
      <form className="form-despesa__grid">
        
        <div className="form-despesa__field form-despesa__field--flex">
          <label className="form-despesa__label">Descrição</label>
          <input className="form-despesa__input" type="text" value={descricao} onChange={(e) => onChange('descricao', e.target.value)} placeholder="Ex: Café no aeroporto" />
        </div>

        <div className="form-despesa__field form-despesa__field--small">
          <label className="form-despesa__label">Valor Final (€)</label>
          <input className="form-despesa__input" type="number" step="0.01" value={valor} onChange={(e) => onChange('valor', e.target.value)} placeholder="0.00" disabled={usarCambio} style={{ backgroundColor: usarCambio ? '#f1f5f9' : '#fff', color: usarCambio ? '#16a34a' : 'inherit', fontWeight: usarCambio ? 'bold' : 'normal' }} />
        </div>

        <div className="form-despesa__cambio-toggle">
          <label><input type="checkbox" checked={usarCambio} onChange={e => onChange('usarCambio', e.target.checked)} /> 🌍 Gasto em Moeda Estrangeira?</label>
        </div>

        <SeccaoCambio usarCambio={usarCambio} moeda={moeda} valorEstrangeiro={valorEstrangeiro} taxaCambio={taxaCambio} onChange={onChange} />

        <div className="form-despesa__field form-despesa__field--flex">
          <label className="form-despesa__label">Viagem</label>
          <select className="form-despesa__input" value={viagemId} onChange={(e) => onChange('viagemId', e.target.value)} disabled={editando}>
            {viagens.map(v => <option key={v.id} value={v.id}>{v.destino}</option>)}
          </select>
        </div>

        {etapasDaViagem.length > 0 && (
          <div className="form-despesa__field form-despesa__field--flex">
            <label className="form-despesa__label">Etapa / Cidade</label>
            <select className="form-despesa__input" value={etapa} onChange={(e) => onChange('etapa', e.target.value)}>
              <option value="">Geral (Sem Etapa)</option>
              {etapasDaViagem.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        )}

        <div className="form-despesa__field form-despesa__field--flex">
          <label className="form-despesa__label">Categoria</label>
          <select className="form-despesa__input" value={categoriaId} onChange={(e) => onChange('categoriaId', e.target.value)}>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </div>

        <div className="form-despesa__field form-despesa__field--flex">
          <label className="form-despesa__label">Quem pagou?</label>
          <select className="form-despesa__input" value={membroId || ''} onChange={(e) => onChange('membroId', e.target.value)}>
            <option value="">-- Selecione quem pagou --</option>
            {membrosDaViagem.length > 0 ? membrosDaViagem.map(m => <option key={m.id} value={m.id}>{m.nome}</option>) : <option value="" disabled>Sem membros nesta viagem</option>}
          </select>
        </div>

        <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#1e293b', fontWeight: '500' }}>
              <input type="checkbox" checked={usarDivisaoExata || false} onChange={e => onChange('usarDivisaoExata', e.target.checked)} />
              ⚖️ Divisão Assimétrica (Valores exatos)
            </label>
          </div>

          {usarDivisaoExata ? (
            <SeccaoDivisaoExata membrosDaViagem={membrosDaViagem} divisaoExata={divisaoExata} valorTotal={valor} onChange={onChange} />
          ) : (
            <SeccaoEnvolvidos membrosDaViagem={membrosDaViagem} envolvidosIds={envolvidosIds} onChange={onChange} />
          )}
        </div>

        <button type="button" onClick={onSubmit} className="form-despesa__submit" style={{ '--btn-bg': editando ? '#f59e0b' : '#2563eb' }}>
          {editando ? 'Atualizar' : 'Gravar Gasto'}
        </button>
      </form>
    </div>
  );
}

export default FormDespesa;