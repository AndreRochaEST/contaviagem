import { _req, _db, _val, _out, _exec } from "@netuno/server-types";

try {
    const viagemId = _req.getInt("viagem_id");
    if (!viagemId) {
        _out.json({ erro: "viagem_id é obrigatório" });
        _exec.stop();
    }

    const viagem = _db.queryFirst(
        "SELECT destino FROM viagem WHERE id = ? AND active = true",
        viagemId
    );
    if (!viagem) {
        _out.json({ erro: "Viagem não encontrada" });
        _exec.stop();
    }

    const itinerarios = _db.query(
        "SELECT uid, local, data_hora, notas FROM itinerario WHERE viagem_id = ? AND active = true ORDER BY data_hora ASC",
        viagemId
    );

    const transportes = _db.query(
        "SELECT uid, operadora, origem, destino, partida, lugar FROM transporte WHERE viagem_id = ? AND active = true ORDER BY partida ASC",
        viagemId
    );

    let icsContent = "BEGIN:VCALENDAR\n";
    icsContent += "VERSION:2.0\n";
    icsContent += "PRODID:-//ContaViagem//PT\n";
    icsContent += "CALSCALE:GREGORIAN\n";

    itinerarios.forEach(item => {
        const dataHora = item.getString("data_hora");
        if (!dataHora) return;
        const dt = dataHora.replace(/[-:]/g, '').replace(' ', 'T') + '00';
        const local = item.getString("local") || "Local";
        const notas = item.getString("notas") || "";
        icsContent += "BEGIN:VEVENT\n";
        icsContent += `UID:${item.getString("uid")}\n`;
        icsContent += `DTSTART:${dt}\n`;
        icsContent += `DTEND:${dt}\n`;
        icsContent += `SUMMARY:${local}\n`;
        icsContent += `DESCRIPTION:${notas}\n`;
        icsContent += "END:VEVENT\n";
    });

    transportes.forEach(t => {
        const partida = t.getString("partida");
        if (!partida) return;
        const dt = partida.replace(/[-:]/g, '').replace(' ', 'T') + '00';
        const origem = t.getString("origem") || "";
        const destino = t.getString("destino") || "";
        const operadora = t.getString("operadora") || "";
        const lugar = t.getString("lugar") || "";
        icsContent += "BEGIN:VEVENT\n";
        icsContent += `UID:${t.getString("uid")}\n`;
        icsContent += `DTSTART:${dt}\n`;
        icsContent += `DTEND:${dt}\n`;
        icsContent += `SUMMARY:Transporte ${operadora} (${origem} → ${destino})\n`;
        icsContent += `DESCRIPTION:Lugar: ${lugar}\n`;
        icsContent += "END:VEVENT\n";
    });

    icsContent += "END:VCALENDAR";

    _out.header("Content-Type", "text/calendar; charset=utf-8");
    _out.header("Content-Disposition", `attachment; filename="itinerario_${viagemId}.ics"`);

    _out.print(icsContent);

} catch (e) {
    _out.json({ erro: "Erro interno", detalhe: e.message });
}