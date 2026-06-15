const listaViagens = _db.query("SELECT * FROM viagem");

_out.json(listaViagens);