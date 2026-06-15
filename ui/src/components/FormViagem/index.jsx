import './index.less';

function FormViagem({ 
  editando, 
  destino, 
  dataInicio, 
  dataFim, 
  orcamento,
  onChange,
  onSubmit 
}) {
  return (
    <div className="form-container panel-animado form-viagem">
      <h3 className="form-title">
        {editando ? '✏️ Atualizar Viagem' : '🌍 Detalhes da Viagem'}
      </h3>
      <form className="form-grid">
        
        <div className="form-field form-field--double">
          <label className="form-label">Destino / Nome da Rota</label>
          <input 
            className="form-input"
            type="text" 
            value={destino} 
            onChange={(e) => onChange('destino', e.target.value)}
            placeholder="Ex: Paris, França" 
          />
        </div>

        <div className="form-field-row">
          <div className="form-field">
            <label className="form-label">Início</label>
            <input className="form-input" type="date" value={dataInicio} onChange={(e) => onChange('dataInicio', e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Fim</label>
            <input className="form-input" type="date" value={dataFim} onChange={(e) => onChange('dataFim', e.target.value)} />
          </div>
        </div>

        <div className="form-field form-field--small">
          <label className="form-label">Orçamento (€)</label>
          <input className="form-input" type="number" step="1" value={orcamento} onChange={(e) => onChange('orcamento', e.target.value)} placeholder="0.00" />
        </div>

        <button type="button" onClick={onSubmit} className="btn-submit" style={{ '--btn-bg': editando ? '#f59e0b' : '#10b981' }}>
          {editando ? 'Atualizar' : 'Gravar Rota'}
        </button>
      </form>
    </div>
  );
}

export default FormViagem;
