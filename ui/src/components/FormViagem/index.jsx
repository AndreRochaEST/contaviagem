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
    <div className="form-container panel-animado" style={{ 
      backgroundColor: '#fff', 
      padding: '20px', 
      borderRadius: '12px', 
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', 
      marginBottom: '30px' 
    }}>
      <h3 style={{ marginTop: 0, color: '#1e293b' }}>
        {editando ? '✏️ Atualizar Viagem' : '🌍 Detalhes da Viagem'}
      </h3>
      <form style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', flex: '2', minWidth: '200px' }}>
          <label style={{ fontSize: '13px', color: '#64748b', marginBottom: '5px' }}>Destino / Nome da Rota</label>
          <input 
            type="text" 
            value={destino} 
            onChange={(e) => onChange('destino', e.target.value)}
            placeholder="Ex: Paris, França" 
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
          />
        </div>

        <div style={{ display: 'flex', gap: '15px', flex: '2', minWidth: '250px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
            <label style={{ fontSize: '13px', color: '#64748b', marginBottom: '5px' }}>Início</label>
            <input 
              type="date" 
              value={dataInicio} 
              onChange={(e) => onChange('dataInicio', e.target.value)}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
            <label style={{ fontSize: '13px', color: '#64748b', marginBottom: '5px' }}>Fim</label>
            <input 
              type="date" 
              value={dataFim} 
              onChange={(e) => onChange('dataFim', e.target.value)}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: '1', minWidth: '120px' }}>
          <label style={{ fontSize: '13px', color: '#64748b', marginBottom: '5px' }}>Orçamento (€)</label>
          <input 
            type="number" 
            step="1" 
            value={orcamento} 
            onChange={(e) => onChange('orcamento', e.target.value)}
            placeholder="0.00" 
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
          />
        </div>

        <button 
          type="button" 
          onClick={onSubmit}
          style={{ 
            padding: '11px 20px', 
            backgroundColor: editando ? '#f59e0b' : '#10b981', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: 'pointer', 
            fontWeight: 'bold', 
            height: '42px' 
          }}
        >
          {editando ? 'Atualizar' : 'Gravar Rota'}
        </button>
      </form>
    </div>
  );
}

export default FormViagem;
