import { _req, _db, _val, _out, _exec } from "@netuno/server-types";

const uid = _req.getString("uid");

const dbViagem = _db.queryFirst("SELECT id FROM viagem WHERE uid = ?", uid);

if (!dbViagem) {
    _out.json(_val.map().set("sucesso", false).set("erro", "Viagem não encontrada."));
    _exec.stop();
}
const viagemId = dbViagem.getInt("id");

try {
    _db.execute("DELETE FROM despesa WHERE viagem_id = ?", viagemId);
    _db.execute("DELETE FROM membro WHERE viagem_id = ?", viagemId);

    if (_db.delete("viagem", uid)) {
        _out.json(_val.map().set("sucesso", true));
    } else {
        _out.json(_val.map().set("sucesso", false).set("erro", "Falha ao apagar a viagem."));
    }
} catch (e) {
    _out.json(_val.map().set("sucesso", false).set("erro", "Erro interno ao limpar os dados da viagem."));
}
