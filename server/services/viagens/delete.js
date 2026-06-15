const uid = _req.getString("uid");

if (_db.delete("viagem", uid)) {
    _out.json(_val.init().set("sucesso", true));
} else {
    _out.json(_val.init().set("sucesso", false).set("erro", "Apaga primeiro os gastos associados a esta viagem."));
}