var viagemId = _req.getInt("viagem_id");

var dbTarefas = _db.query(
    "SELECT * FROM tarefa WHERE viagem_id = ?",
    viagemId
);

_out.json(
    _val.map()
        .set("sucesso", true)
        .set("data", dbTarefas)
);