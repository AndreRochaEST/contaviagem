var uid = _req.get("uid");
var data = _req.get("data");
var hora = _req.get("hora");
var local = _req.get("local");
var notas = _req.get("notas");

if (uid != "") {
    var dataHora = "";
    
    if (data != "" && hora != "") {
        dataHora = data + " " + hora + (hora.length <= 5 ? ":00" : "");
    } else if (data != "") {
        dataHora = data + " 00:00:00";
    }

    _db.execute(
        "UPDATE itinerario SET data_hora = ?, local = ?, notas = ? WHERE uid = ?",
        dataHora, local, notas, uid
    );
    
    _out.json(_val.map().set("sucesso", true));
} else {
    _out.json(_val.map().set("sucesso", false).set("erro", "UID não fornecido."));
}