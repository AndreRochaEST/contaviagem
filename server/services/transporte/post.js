_db.insert("transporte", _val.map()
    .set("active", 1)
    .set("viagem_id", _req.getInt("viagem_id"))
    .set("operadora", _req.getString("operadora"))
    .set("origem", _req.getString("origem"))
    .set("destino", _req.getString("destino"))
    .set("partida", _req.getString("partida"))
    .set("lugar", _req.getString("lugar"))
);
_out.json(_val.map().set("sucesso", true));