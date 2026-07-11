import { _req, _db, _val, _out, _exec } from "@netuno/server-types";

const uid = _req.getString("uid");
const orcamento = _req.getFloat("orcamento");

if (!uid || orcamento == null) {
    _out.json(_val.map().set("sucesso", false).set("erro", "UID e orçamento necessários"));
    _exec.stop();
}

const atualizado = _db.update("etapa_orcamento", uid, _val.map().set("orcamento", orcamento));
_out.json(_val.map().set("sucesso", !!atualizado));