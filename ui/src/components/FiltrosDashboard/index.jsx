import React from 'react';

function FiltrosDashboard({ filtroTexto, onFiltroTextoChange, filtroCategoria, onFiltroCategoriaChange, categorias }) {
  return (
    <div className="dashboard__filters">
      <div className="dashboard__filter-group dashboard__filter-group--large">
        <label className="dashboard__filter-label">🔍 Pesquisar nos Gastos</label>
        <input 
          type="text" 
          value={filtroTexto} 
          onChange={e => onFiltroTextoChange && onFiltroTextoChange(e.target.value)} 
          placeholder="Ex: Café, Comboio, Hotel..." 
          className="dashboard__filter-input"
        />
      </div>
      <div className="dashboard__filter-group dashboard__filter-group--small">
        <label className="dashboard__filter-label">📁 Categoria</label>
        <select 
          value={filtroCategoria} 
          onChange={e => onFiltroCategoriaChange && onFiltroCategoriaChange(e.target.value)} 
          className="dashboard__filter-input"
        >
          <option value="todos">Todas as Categorias</option>
          {categorias.map(c => (
            <option key={c.id} value={c.nome}>{c.nome}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FiltrosDashboard;