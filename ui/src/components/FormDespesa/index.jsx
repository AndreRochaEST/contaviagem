import './index.less';

function FormDespesa({ 
  editando, 
  descricao, 
  valor, 
  viagemId,
  categoriaId,
  membroId,
  envolvidosIds = [],
  viagens,
  categorias,
  membros,
  onChange,
  onSubmit 
}) {
  
  const membrosDaViagem = membros ? membros.filter(m => m.viagem_id == viagemId) : [];

  const handleCheckboxChange = (idStr) => {
    let novos = [...envolvidosIds];
    if (novos.includes(idStr)) {
      novos = novos.filter(id => id !== idStr);
    } else {
      novos.push(idStr);
    }
    onChange('envolvidosIds', novos);
  };

  return (
    <div className="form-container panel-animado form-despesa">
      <h3 className="form-despesa__title">
        {editando ? '✏️ Atualizar Gasto' : '+ Detalhes do Gasto'}
      </h3>
      <form className="form-despesa__grid">
        
        <div className="form-despesa__field form-despesa__field--flex">
          <label className="form-despesa__label">Descrição</label>
          <input 
            className="form-despesa__input"
            type="text" 
            value={descricao} 
            onChange={(e) => onChange('descricao', e.target.value)}
            placeholder="Ex: Café no aeroporto" 
          />
        </div>

        <div className="form-despesa__field form-despesa__field--small">
          <label className="form-despesa__label">Valor (€)</label>
          <input 
            className="form-despesa__input"
            type="number" 
            step="0.01" 
            value={valor} 
            onChange={(e) => onChange('valor', e.target.value)}
            placeholder="0.00" 
          />
        </div>

        <div className="form-despesa__field form-despesa__field--flex">
          <label className="form-despesa__label">Viagem</label>
          <select 
            className="form-despesa__input"
            value={viagemId} 
            onChange={(e) => onChange('viagemId', e.target.value)}
            disabled={editando}
          >
            {viagens.map(v => (
              <option key={v.id} value={v.id}>{v.destino}</option>
            ))}
          </select>
        </div>

        <div className="form-despesa__field form-despesa__field--flex">
          <label className="form-despesa__label">Categoria</label>
          <select 
            className="form-despesa__input"
            value={categoriaId} 
            onChange={(e) => onChange('categoriaId', e.target.value)}
          >
            {categorias.map(c => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>

        <div className="form-despesa__field form-despesa__field--flex">
          <label className="form-despesa__label">Quem pagou?</label>
          <select 
            className="form-despesa__input"
            value={membroId || ''} 
            onChange={(e) => onChange('membroId', e.target.value)}
          >
            <option value="">-- Selecione quem pagou --</option>
            {membrosDaViagem.length > 0 ? (
              membrosDaViagem.map(m => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))
            ) : (
              <option value="" disabled>Sem membros nesta viagem</option>
            )}
          </select>
        </div>

        {membrosDaViagem.length > 0 && (
          <div className="form-despesa__envolvidos">
            <label className="form-despesa__label">Para quem foi? (Deixa vazio para dividir por todos)</label>
            <div className="form-despesa__checkboxes">
              {membrosDaViagem.map(m => (
                <label key={m.id} className="form-despesa__checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={envolvidosIds.includes(m.id.toString())}
                    onChange={() => handleCheckboxChange(m.id.toString())}
                  />
                  {m.nome}
                </label>
              ))}
            </div>
          </div>
        )}

        <button 
          type="button" 
          onClick={onSubmit}
          className="form-despesa__submit"
          style={{ '--btn-bg': editando ? '#f59e0b' : '#2563eb' }}
        >
          {editando ? 'Atualizar' : 'Gravar Gasto'}
        </button>
      </form>
    </div>
  );
}

export default FormDespesa;