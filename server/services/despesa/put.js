import { _req, _db, _val, _out } from "@netuno/server-types";

const uid = _req.getString("uid");

const atualizado = _db.update("despesa", uid, _val.map()
    .set("descricao", _req.getString("descricao"))
    .set("valor", _req.getFloat("valor"))
    .set("viagem_id", _req.getInt("viagem_id"))
    .set("categoria_id", _req.getInt("categoria_id"))
    .set("pago_por_id", _req.getInt("pago_por_id"))
    .set("envolvidos_ids", _req.getString("envolvidos_ids"))
    .set("etapa", _req.getString("etapa"))
    .set("divisao_exata", _req.getString("divisao_exata"))
);

if (atualizado) {
    _out.json(_val.map().set("sucesso", true));
} else {
    _out.json(_val.map().set("sucesso", false).set("erro", "Falha ao atualizar despesa."));
}