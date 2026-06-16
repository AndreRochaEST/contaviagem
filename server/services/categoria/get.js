import { _req, _db, _val, _out } from "@netuno/server-types";

const lista = _db.find("categoria", _val.map());

_out.json(lista);