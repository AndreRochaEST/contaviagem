import { _req, _db, _val, _out } from "@netuno/server-types";

const listaViagens = _db.find("viagem", _val.map());

_out.json(listaViagens);