import './index.less';

function FormDespesa({ 
  editando, 
  descricao, 
  valor, 
  viagemId,
  categoriaId,
  membroId,
  envolvidosIds = [],
  usarCambio,
  moeda,
  valorEstrangeiro,
  taxaCambio,
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
          <label className="form-despesa__label">Valor Final (€)</label>
          <input 
            className="form-despesa__input"
            type="number" 
            step="0.01" 
            value={valor} 
            onChange={(e) => onChange('valor', e.target.value)}
            placeholder="0.00" 
            disabled={usarCambio}
            style={{ backgroundColor: usarCambio ? '#f1f5f9' : '#fff', color: usarCambio ? '#16a34a' : 'inherit', fontWeight: usarCambio ? 'bold' : 'normal' }}
            title={usarCambio ? "Calculado automaticamente pelo câmbio" : ""}
          />
        </div>

        <div className="form-despesa__cambio-toggle">
          <label>
            <input 
              type="checkbox" 
              checked={usarCambio} 
              onChange={e => onChange('usarCambio', e.target.checked)} 
            />
            🌍 Gasto em Moeda Estrangeira?
          </label>
        </div>

        {usarCambio && (
          <div className="form-despesa__cambio-box">
            <div className="form-despesa__field form-despesa__field--small">
              <label className="form-despesa__label">Moeda</label>
              <select className="form-despesa__input" value={moeda} onChange={e => onChange('moeda', e.target.value)}>
                <option value="GBP">GBP (£)</option>
                <option value="USD">USD ($)</option>
                <option value="CHF">CHF (Fr)</option>
                <option value="BRL">BRL (R$)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
            <div className="form-despesa__field form-despesa__field--flex">
              <label className="form-despesa__label">Valor na Moeda Original</label>
              <input 
                className="form-despesa__input"
                type="number" 
                step="0.01" 
                value={valorEstrangeiro} 
                onChange={(e) => onChange('valorEstrangeiro', e.target.value)}
                placeholder="Ex: 50.00" 
              />
            </div>
            <div className="form-despesa__field form-despesa__field--flex">
              <label className="form-despesa__label">Taxa de Conversão para €</label>
              <input 
                className="form-despesa__input"
                type="number" 
                step="0.0001" 
                value={taxaCambio} 
                onChange={(e) => onChange('taxaCambio', e.target.value)}
                placeholder="Ex: 1.17" 
              />
            </div>
          </div>
        )}

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