const lista = _db.query("SELECT id, nome FROM categoria ORDER BY id");
_out.json(lista);