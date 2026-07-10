var viagemId = _req.get("viagem_id");
var membroId = _req.get("membro_id");
var valor = _req.get("valor");

if (viagemId && membroId && valor) {
    _db.insert(
        "cofre_contribuicao",
        _val.map()
            .set("viagem_id", parseInt(viagemId))
            .set("membro_id", parseInt(membroId))
            .set("valor", parseFloat(valor))
    );
    
    _out.json(_val.map().set("sucesso", true));
} else {
    _out.json(_val.map().set("sucesso", false).set("erro", "Dados incompletos."));
}