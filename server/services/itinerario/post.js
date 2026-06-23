var dbInsert = _db.insert("itinerario", _val.map()
    .set("active", 1)
    .set("viagem_id", _req.getInt("viagem_id"))
    .set("data_hora", _req.getString("data") + " " + _req.getString("hora") + ":00")
    .set("local", _req.getString("local"))
    .set("notas", _req.getString("notas"))
);

_out.json(
    _val.map()
        .set("sucesso", true)
);