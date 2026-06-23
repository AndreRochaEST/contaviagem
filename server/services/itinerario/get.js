var viagemId = _req.getInt("viagem_id");

var dbItinerarios = _db.query(
    "SELECT * FROM itinerario WHERE viagem_id = ?",
    viagemId
);

_out.json(
    _val.map()
        .set("sucesso", true)
        .set("data", dbItinerarios)
);