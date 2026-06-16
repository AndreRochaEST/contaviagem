import { _req, _db, _val, _out } from "@netuno/server-types";

const listaMembros = _db.find("membro", _val.map());

_out.json(listaMembros);