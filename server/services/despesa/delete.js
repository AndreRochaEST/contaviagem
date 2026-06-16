import { _req, _db, _val, _out } from "@netuno/server-types";

const uid = _req.getString("uid");

if (_db.delete("despesa", uid)) {
    _out.json(_val.map().set("sucesso", true));
} else {
    _out.json(_val.map().set("sucesso", false).set("erro", "Erro ao apagar."));
}