const uid = _req.getString("uid");

const atualizado = _db.update("viagem", uid, _val.init()
    .set("destino", _req.getString("destino"))
    .set("data_de_inicio", _req.getString("data_de_inicio"))
    .set("data_de_fim", _req.getString("data_de_fim"))
    .set("orcamento", _req.getFloat("orcamento"))
);

if (atualizado) {
    _out.json(_val.init().set("sucesso", true));
} else {
    _out.json(_val.init().set("sucesso", false).set("erro", "Falha ao atualizar viagem."));
}