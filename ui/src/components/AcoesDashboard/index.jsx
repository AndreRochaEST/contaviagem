import React from 'react';

function AcoesDashboard({ mostrarFormViagem, alternarFormViagem, mostrarFormDespesa, alternarFormDespesa }) {
  return (
    <div className="dashboard__actions">
      <button 
        className={`btn-toggle ${mostrarFormViagem ? 'btn-toggle--active-green' : ''}`}
        onClick={alternarFormViagem}
      >
        {mostrarFormViagem ? '✖ Fechar Novo Plano' : '🌍 Planear Nova Viagem'}
      </button>
      <button 
        className={`btn-toggle ${mostrarFormDespesa ? 'btn-toggle--active' : ''}`}
        onClick={alternarFormDespesa}
      >
        {mostrarFormDespesa ? '✖ Fechar Novo Gasto' : '+ Registar Novo Gasto'}
      </button>
    </div>
  );
}

export default AcoesDashboard;