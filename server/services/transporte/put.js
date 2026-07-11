import { _req, _db, _val, _out, _exec } from "@netuno/server-types";

const uid = _req.getString("uid");

if (!uid) {
    _out.json(_val.map().set("sucesso", false).set("erro", "UID não fornecido."));
    _exec.stop();
}

const atualizado = _db.update("transporte", uid, _val.map()
    .set("operadora", _req.getString("operadora"))
    .set("origem", _req.getString("origem"))
    .set("destino", _req.getString("destino"))
    .set("partida", _req.getString("partida"))
    .set("lugar", _req.getString("lugar"))
);

if (atualizado) {
    _out.json(_val.map().set("sucesso", true));
} else {
    _out.json(_val.map().set("sucesso", false).set("erro", "Falha ao atualizar transporte."));
}