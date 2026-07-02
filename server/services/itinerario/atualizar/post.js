var uid = _req.getString("uid");
var data = _req.getString("data");
var hora = _req.getString("hora");

if (uid != "") {
    var dataHora = "";
    
    if (data != "" && hora != "") {
        dataHora = data + " " + hora + ":00";
    } else if (data != "") {
        dataHora = data + " 00:00:00";
    }

    _db.execute(
        "UPDATE itinerario SET data = ?, hora = ?, data_hora = ? WHERE uid = ?",
        data, hora, dataHora, uid
    );
    
    _out.json(_val.map().set("sucesso", true));
} else {
    _out.json(_val.map().set("sucesso", false).set("erro", "UID não fornecido."));
}