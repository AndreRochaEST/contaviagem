import { _req, _db, _val, _out } from "@netuno/server-types";

const uid = _req.getString("uid");

const atualizado = _db.update("membro", uid, _val.map()
    .set("nome", _req.getString("nome"))
    .set("viagem_id", _req.getInt("viagem_id"))
);

if (atualizado) {
    _out.json(_val.map().set("sucesso", true));
} else {
    _out.json(_val.map().set("sucesso", false).set("erro", "Falha ao atualizar membro."));
}