const novoId = _db.insert("viagem", _val.init()
    .set("destino", _req.getString("destino"))
    .set("data_de_inicio", _req.getString("data_de_inicio"))
    .set("data_de_fim", _req.getString("data_de_fim"))
    .set("orcamento", _req.getFloat("orcamento"))
);

if (novoId) {
    _out.json(_val.init().set("sucesso", true).set("id", novoId));
} else {
    _out.json(_val.init().set("sucesso", false).set("erro", "Falha ao gravar viagem."));
}