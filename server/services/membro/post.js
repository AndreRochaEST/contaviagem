import { _req, _db, _val, _out } from "@netuno/server-types";

const novoId = _db.insert("membro", _val.map()
    .set("nome", _req.getString("nome"))
    .set("viagem_id", _req.getInt("viagem_id"))
);

if (novoId) {
    _out.json(_val.map().set("sucesso", true).set("id", novoId));
} else {
    _out.json(_val.map().set("sucesso", false).set("erro", "Falha ao adicionar membro."));
}