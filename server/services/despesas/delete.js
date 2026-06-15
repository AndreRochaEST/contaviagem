const uid = _req.getString("uid");

if (_db.delete("despesa", uid)) {
    _out.json(_val.init().set("sucesso", true));
} else {
    _out.json(_val.init().set("sucesso", false).set("erro", "Erro ao apagar."));
}