var uid = _req.getString("uid");

_db.update("documento", uid, _val.map()
    .set("active", 0)
);

_out.json(
    _val.map()
        .set("sucesso", true)
);