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
    <div className="form-container panel-animado" style={{ 
      backgroundColor: '#fff', 
      padding: '20px', 
      borderRadius: '12px', 
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', 
      marginBottom: '30px' 
    }}>
      <h3 style={{ marginTop: 0, color: '#1e293b' }}>
        {editando ? '✏️ Atualizar Gasto' : '+ Detalhes do Gasto'}
      </h3>
      <form style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', flex: '1', minWidth: '200px' }}>
          <label style={{ fontSize: '13px', color: '#64748b', marginBottom: '5px' }}>Descrição</label>
          <input 
            type="text" 
            value={descricao} 
            onChange={(e) => onChange('descricao', e.target.value)}
            placeholder="Ex: Café no aeroporto" 
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', width: '120px' }}>
          <label style={{ fontSize: '13px', color: '#64748b', marginBottom: '5px' }}>Valor (€)</label>
          <input 
            type="number" 
            step="0.01" 
            value={valor} 
            onChange={(e) => onChange('valor', e.target.value)}
            placeholder="0.00" 
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: '1', minWidth: '150px' }}>
          <label style={{ fontSize: '13px', color: '#64748b', marginBottom: '5px' }}>Viagem</label>
          <select 
            value={viagemId} 
            onChange={(e) => onChange('viagemId', e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }} 
            disabled={editando}
          >
            {viagens.map(v => (
              <option key={v.id} value={v.id}>{v.destino}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: '1', minWidth: '150px' }}>
          <label style={{ fontSize: '13px', color: '#64748b', marginBottom: '5px' }}>Categoria</label>
          <select 
            value={categoriaId} 
            onChange={(e) => onChange('categoriaId', e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}
          >
            {categorias.map(c => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>

        <button 
          type="button" 
          onClick={onSubmit}
          style={{ 
            padding: '11px 20px', 
            backgroundColor: editando ? '#f59e0b' : '#2563eb', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: 'pointer', 
            fontWeight: 'bold', 
            height: '42px' 
          }}
        >
          {editando ? 'Atualizar' : 'Gravar Gasto'}
        </button>
      </form>
    </div>
  );
}

export default FormDespesa;
