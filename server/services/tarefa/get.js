var dbTarefas = _db.query("SELECT * FROM tarefa");

_out.json(
    _val.map()
        .set("sucesso", true)
        .set("data", dbTarefas)
);