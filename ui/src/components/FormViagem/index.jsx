import React from 'react';
import './index.less';

function FormViagem({ editando, destino, etapas, dataInicio, dataFim, orcamento, onChange, onSubmit }) {
  return (
    <div className="form-container panel-animado form-viagem">
      <h3 className="form-viagem__title">{editando ? '✏️ Atualizar Viagem' : '🌍 Nova Viagem'}</h3>
      <form className="form-viagem__grid">
        <div className="form-viagem__field form-viagem__field--flex">
          <label className="form-viagem__label">Destino Principal</label>
          <input className="form-viagem__input" type="text" value={destino} onChange={e => onChange('destino', e.target.value)} />
        </div>
        <div className="form-viagem__field form-viagem__field--flex">
          <label className="form-viagem__label">Etapas / Cidades (separadas por vírgula)</label>
          <input className="form-viagem__input" type="text" value={etapas} onChange={e => onChange('etapas', e.target.value)} placeholder="Ex: Lisboa, Madrid, Barcelona" />
        </div>
        <div className="form-viagem__field form-viagem__field--small">
          <label className="form-viagem__label">Data Início</label>
          <input className="form-viagem__input" type="date" value={dataInicio} onChange={e => onChange('dataInicio', e.target.value)} />
        </div>
        <div className="form-viagem__field form-viagem__field--small">
          <label className="form-viagem__label">Data Fim</label>
          <input className="form-viagem__input" type="date" value={dataFim} onChange={e => onChange('dataFim', e.target.value)} />
        </div>
        <div className="form-viagem__field form-viagem__field--small">
          <label className="form-viagem__label">Orçamento (€)</label>
          <input className="form-viagem__input" type="number" step="0.01" value={orcamento} onChange={e => onChange('orcamento', e.target.value)} />
        </div>
        <button type="button" onClick={onSubmit} className="form-viagem__submit" style={{ '--btn-bg': editando ? '#f59e0b' : '#16a34a' }}>
          {editando ? 'Atualizar Viagem' : 'Criar Viagem'}
        </button>
      </form>
    </div>
  );
}

export default FormViagem;