const listaDespesas = _db.query(`
    SELECT 
        d.*, 
        c.nome AS categoria_nome 
    FROM despesa d
    INNER JOIN categoria c ON d.categoria_id = c.id
`);

_out.json(listaDespesas);