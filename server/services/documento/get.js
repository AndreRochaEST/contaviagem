var viagemId = _req.getInt("viagem_id");

var dbDocs = _db.query(
    "SELECT * FROM documento WHERE viagem_id = ?",
    viagemId
);

_out.json(
    _val.map()
        .set("sucesso", true)
        .set("data", dbDocs)
);