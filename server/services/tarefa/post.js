var dbInsert = _db.insert("tarefa", _val.map()
    .set("viagem_id", _req.getInt("viagem_id"))
    .set("texto", _req.getString("texto"))
    .set("feito", _req.getBoolean("feito", false))
);

_out.json(
    _val.map()
        .set("sucesso", true)
        .set("uid", dbInsert)
);