var uid = _req.get("uid");

if (uid) {
    _db.execute("UPDATE cofre_contribuicao SET active = false WHERE uid = ?", uid);
    _out.json(_val.map().set("sucesso", true));
} else {
    _out.json(_val.map().set("sucesso", false));
}