import { _req, _db, _val, _out } from "@netuno/server-types";

const novoId = _db.insert("despesa", _val.map()
    .set("descricao", _req.getString("descricao"))
    .set("valor", _req.getFloat("valor"))
    .set("viagem_id", _req.getInt("viagem_id"))
    .set("categoria_id", _req.getInt("categoria_id"))
    .set("pago_por_id", _req.getInt("pago_por_id"))
    .set("envolvidos_ids", _req.getString("envolvidos_ids"))
    .set("etapa", _req.getString("etapa"))
);

if (novoId) {
    _out.json(_val.map().set("sucesso", true).set("id", novoId));
} else {
    _out.json(_val.map().set("sucesso", false).set("erro", "Falha ao gravar."));
}