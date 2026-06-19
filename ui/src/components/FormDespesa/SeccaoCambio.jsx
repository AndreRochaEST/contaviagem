import React from 'react';

const SeccaoCambio = ({ usarCambio, moeda, valorEstrangeiro, taxaCambio, onChange }) => {
  if (!usarCambio) return null;

  return (
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
        <label className="form-despesa__label">Taxa p/ € </label>
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
  );
};

export default SeccaoCambio;