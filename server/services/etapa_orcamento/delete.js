import { _req, _db, _val, _out } from "@netuno/server-types";

const uid = _req.getString("uid");
if (uid) {
    _db.delete("etapa_orcamento", uid);
}
_out.json(_val.map().set("sucesso", true));