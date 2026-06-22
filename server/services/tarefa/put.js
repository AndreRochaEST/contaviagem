var uid = _req.getString("uid");
var feito = _req.getBoolean("feito");

_db.update("tarefa", uid, _val.map()
    .set("feito", feito)
    .set("active", 1)
);

_out.json(
    _val.map()
        .set("sucesso", true)
);