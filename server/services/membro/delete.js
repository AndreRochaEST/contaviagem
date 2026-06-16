import { _req, _db, _val, _out } from "@netuno/server-types";

const uid = _req.getString("uid");

if (_db.delete("membro", uid)) {
    _out.json(_val.map().set("sucesso", true));
} else {
    _out.json(_val.map().set("sucesso", false).set("erro", "Não podes apagar este membro porque ele já tem gastos associados a ele."));
}