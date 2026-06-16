import { _req, _db, _val, _out } from "@netuno/server-types";

const uid = _req.getString("uid");

if (_db.delete("viagem", uid)) {
    _out.json(_val.map().set("sucesso", true));
} else {
    _out.json(_val.map().set("sucesso", false).set("erro", "Apaga primeiro os gastos associados a esta viagem."));
}