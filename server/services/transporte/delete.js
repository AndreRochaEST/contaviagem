var uid = _req.getString("uid");

_db.execute("DELETE FROM transporte WHERE uid = ?", uid);

_out.json(
    _val.map()
        .set("sucesso", true)
);