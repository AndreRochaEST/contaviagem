var uid = _req.getString("uid");

_db.delete("tarefa", uid);

_out.json(
    _val.map()
        .set("sucesso", true)
);