import { _req, _db, _val, _out } from "@netuno/server-types";

const viagemId = _req.getInt("viagem_id");
if (!viagemId) {
    _out.json(_val.map().set("sucesso", false).set("erro", "viagem_id obrigatório"));
    _exec.stop();
}

const dbResult = _db.query(
    "SELECT uid, etapa_nome, orcamento FROM etapa_orcamento WHERE viagem_id = ? AND active = true",
    viagemId
);
_out.json(dbResult);