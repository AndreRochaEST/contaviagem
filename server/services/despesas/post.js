const novoId = _db.insert("despesa", _val.init()
    .set("descricao", _req.getString("descricao"))
    .set("valor", _req.getFloat("valor"))
    .set("viagem_id", _req.getInt("viagem_id"))
    .set("categoria_id", _req.getInt("categoria_id"))
);

if (novoId) {
    _out.json(_val.init().set("sucesso", true).set("id", novoId));
} else {
    _out.json(_val.init().set("sucesso", false).set("erro", "Falha ao gravar."));
}