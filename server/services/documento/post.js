var dbInsert = _db.insert("documento", _val.map()
    .set("active", 1)
    .set("viagem_id", _req.getInt("viagem_id"))
    .set("nome", _req.getString("nome"))
    .set("nome_ficheiro", _req.getString("nome_ficheiro"))
    .set("ficheiro", _req.getString("ficheiro"))
);

_out.json(
    _val.map()
        .set("sucesso", true)
);