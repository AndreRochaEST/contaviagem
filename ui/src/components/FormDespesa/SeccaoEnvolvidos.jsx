import React from 'react';

const SeccaoEnvolvidos = ({ membrosDaViagem, envolvidosIds, onChange }) => {
  if (membrosDaViagem.length === 0) return null;

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
  );
};

export default SeccaoEnvolvidos;