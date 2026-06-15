const uid = _req.getString("uid");

const atualizado = _db.update("despesa", uid, _val.init()
    .set("descricao", _req.getString("descricao"))
    .set("valor", _req.getFloat("valor"))
    .set("viagem_id", _req.getInt("viagem_id"))
    .set("categoria_id", _req.getInt("categoria_id"))
);

if (atualizado) {
    _out.json(_val.init().set("sucesso", true));
} else {
    _out.json(_val.init().set("sucesso", false).set("erro", "Falha ao atualizar despesa."));
}