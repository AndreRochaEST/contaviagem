import { _req, _db, _val, _out } from "@netuno/server-types";

const listaDespesas = _db.query(`
    SELECT 
        d.*, 
        c.nome AS categoria_nome 
    FROM despesa d
    INNER JOIN categoria c ON d.categoria_id = c.id
    WHERE d.active = true AND c.active = true
`);

_out.json(listaDespesas);