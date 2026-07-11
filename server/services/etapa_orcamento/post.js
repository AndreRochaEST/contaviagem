import { _req, _db, _val, _out, _exec } from "@netuno/server-types";

const viagemId = _req.getInt("viagem_id");
const etapaNome = _req.getString("etapa_nome");
const orcamento = _req.getFloat("orcamento");

if (!viagemId || !etapaNome || orcamento == null) {
    _out.json(_val.map().set("sucesso", false).set("erro", "Dados incompletos"));
    _exec.stop();
}

_db.execute("DELETE FROM etapa_orcamento WHERE viagem_id = ? AND etapa_nome = ?", viagemId, etapaNome);

const novoId = _db.insert("etapa_orcamento", _val.map()
    .set("viagem_id", viagemId)
    .set("etapa_nome", etapaNome)
    .set("orcamento", orcamento)
);
_out.json(_val.map().set("sucesso", true).set("id", novoId));