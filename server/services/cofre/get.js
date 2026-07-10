var viagemId = _req.getString("viagem_id");

if (viagemId != "") {
    var dbContribuicoes = _db.query(
        "SELECT cc.uid, cc.valor, m.nome as membro_nome FROM cofre_contribuicao cc JOIN membro m ON cc.membro_id = m.id WHERE cc.viagem_id = ? AND cc.active = true", 
        viagemId
    );

    var dbTotalGastoCofre = _db.query(
        "SELECT COALESCE(SUM(valor), 0) as total FROM despesa WHERE viagem_id = ? AND active = true AND pago_por_id = 0", 
        viagemId
    );

    var totalContribuido = 0.0;
    var listaContribuicoes = _val.list();

    for (var i = 0; i < dbContribuicoes.size(); i++) {
        var linha = dbContribuicoes.get(i);
        var valor = parseFloat(linha.getString("valor")) || 0.0;
        totalContribuido += valor;

        listaContribuicoes.add(
            _val.map()
                .set("uid", linha.getString("uid"))
                .set("membro", linha.getString("membro_nome"))
                .set("valor", valor)
        );
    }

    var totalGasto = dbTotalGastoCofre.size() > 0 ? parseFloat(dbTotalGastoCofre.get(0).getString("total")) : 0.0;
    var saldoDisponivel = totalContribuido - totalGasto;

    _out.json(
        _val.map()
            .set("sucesso", true)
            .set("contribuicoes", listaContribuicoes)
            .set("totalContribuido", totalContribuido)
            .set("saldoDisponivel", saldoDisponivel)
    );
} else {
    _out.json(_val.map().set("sucesso", false));
}