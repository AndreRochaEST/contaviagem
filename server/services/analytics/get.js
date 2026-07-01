var dbViagens = _db.query("SELECT COUNT(*) as total FROM viagem WHERE active = true");
var dbGastos = _db.query("SELECT SUM(valor) as total FROM despesa WHERE active = true AND descricao NOT LIKE 'Liquidação:%'");
var dbCategorias = _db.query("SELECT SUM(d.valor) as total, c.nome as categoria FROM despesa d JOIN categoria c ON d.categoria_id = c.id WHERE d.active = true AND d.descricao NOT LIKE 'Liquidação:%' GROUP BY c.nome");

var totalViagens = 0;
if (dbViagens.size() > 0 && dbViagens.get(0).get("total") != null) {
    totalViagens = parseInt(dbViagens.get(0).getString("total"), 10) || 0;
}

var totalGasto = 0.0;
if (dbGastos.size() > 0 && dbGastos.get(0).get("total") != null) {
    totalGasto = parseFloat(dbGastos.get(0).getString("total")) || 0.0;
}

var categoriasSeguras = _val.list();
for (var i = 0; i < dbCategorias.size(); i++) {
    var linha = dbCategorias.get(i);
    var valor = parseFloat(linha.getString("total")) || 0.0;
    var nomeCat = linha.getString("categoria") || "Desconhecida";
    
    categoriasSeguras.add(
        _val.map()
            .set("categoria", nomeCat)
            .set("total", valor)
    );
}

_out.json(
    _val.map()
        .set("sucesso", true)
        .set("totalViagens", totalViagens)
        .set("totalGasto", totalGasto)
        .set("mediaPorViagem", totalViagens > 0 ? (totalGasto / totalViagens) : 0.0)
        .set("porCategoria", categoriasSeguras)
);