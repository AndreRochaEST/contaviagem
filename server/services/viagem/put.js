import { _req, _db, _val, _out } from "@netuno/server-types";

const uid = _req.getString("uid");

const atualizado = _db.update("viagem", uid, _val.map()
    .set("destino", _req.getString("destino"))
    .set("data_de_inicio", _req.getString("data_de_inicio"))
    .set("data_de_fim", _req.getString("data_de_fim"))
    .set("orcamento", _req.getFloat("orcamento"))
    .set("etapas", _req.getString("etapas"))
);

if (atualizado) {
    _out.json(_val.map().set("sucesso", true));
} else {
    _out.json(_val.map().set("sucesso", false).set("erro", "Falha ao atualizar viagem."));
}