var viagemId = _req.getInt("viagem_id");

var dbTransp = _db.query(
    "SELECT * FROM transporte WHERE viagem_id = ?", 
    viagemId
);

_out.json(
    _val.map()
        .set("sucesso", true)
        .set("data", dbTransp)
);