import './index.less';

function FormDespesa({ 
  editando, 
  descricao, 
  valor, 
  viagemId,
  categoriaId,
  viagens,
  categorias,
  onChange,
  onSubmit 
}) {
  return (
    <div className="form-container panel-animado form-despesa">
      <h3 className="form-title">
        {editando ? '✏️ Atualizar Gasto' : '+ Detalhes do Gasto'}
      </h3>
      <form className="form-grid">
        
        <div className="form-field form-field--flex">
          <label className="form-label">Descrição</label>
          <input 
            className="form-input"
            type="text" 
            value={descricao} 
            onChange={(e) => onChange('descricao', e.target.value)}
            placeholder="Ex: Café no aeroporto" 
          />
        </div>

        <div className="form-field form-field--small">
          <label className="form-label">Valor (€)</label>
          <input 
            className="form-input"
            type="number" 
            step="0.01" 
            value={valor} 
            onChange={(e) => onChange('valor', e.target.value)}
            placeholder="0.00" 
          />
        </div>

        <div className="form-field form-field--flex">
          <label className="form-label">Viagem</label>
          <select 
            className="form-input"
            value={viagemId} 
            onChange={(e) => onChange('viagemId', e.target.value)}
            disabled={editando}
          >
            {viagens.map(v => (
              <option key={v.id} value={v.id}>{v.destino}</option>
            ))}
          </select>
        </div>

        <div className="form-field form-field--flex">
          <label className="form-label">Categoria</label>
          <select 
            className="form-input"
            value={categoriaId} 
            onChange={(e) => onChange('categoriaId', e.target.value)}
          >
            {categorias.map(c => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>

        <button 
          type="button" 
          onClick={onSubmit}
          className="btn-submit"
          style={{ '--btn-bg': editando ? '#f59e0b' : '#2563eb' }}
        >
          {editando ? 'Atualizar' : 'Gravar Gasto'}
        </button>
      </form>
    </div>
  );
}

export default FormDespesa;
