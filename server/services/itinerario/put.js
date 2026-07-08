var uid = _req.getString("uid");
var data = _req.getString("data");
var hora = _req.getString("hora");
var local = _req.getString("local");
var notas = _req.getString("notas");

if (uid != "") {
    var dataHora = "";
    
    if (data != "" && hora != "") {
        dataHora = data + " " + hora + (hora.length <= 5 ? ":00" : "");
    } else if (data != "") {
        dataHora = data + " 00:00:00";
    }

    _db.execute(
        "UPDATE itinerario SET data = ?, hora = ?, data_hora = ?, local = ?, notas = ? WHERE uid = ?",
        data, hora, dataHora, local, notas, uid
    );
    
    _out.json(_val.map().set("sucesso", true));
} else {
    _out.json(_val.map().set("sucesso", false).set("erro", "UID não fornecido."));
}