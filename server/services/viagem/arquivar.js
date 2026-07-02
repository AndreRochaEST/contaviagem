var uid = _req.getString("uid");

var dbViagem = _db.query("SELECT arquivada FROM viagem WHERE uid = ?", uid);

if (dbViagem.size() > 0) {
    var estadoAtual = dbViagem.get(0).getBoolean("arquivada");
    
    _db.execute(
        "UPDATE viagem SET arquivada = ? WHERE uid = ?", 
        !estadoAtual, 
        uid
    );

    _out.json(
        _val.map()
            .set("sucesso", true)
            .set("arquivada", !estadoAtual)
    );
} else {
    _out.json(
        _val.map()
            .set("sucesso", false)
            .set("erro", "Viagem não encontrada.")
    );
}