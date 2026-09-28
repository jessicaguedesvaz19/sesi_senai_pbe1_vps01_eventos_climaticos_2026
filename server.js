const express = require("express");
const cors = require("cors");

const eventos = require("./dados.json");

function autoIncrement() {
    return Number(eventos[eventos.length - 1].id) + 1;
}

const cadastrarEvento = (req, res) => {
    const evento = req.body;
    evento.id = autoIncrement();
    eventos.push(evento);
    res.status(201).json(evento);
};

const listarEvento = (req, res) => {
    res.status(200).json(eventos);
};

const buscarEvento = (req, res) => {
    const evento = eventos.find(
        e => e.id == Number(req.params.id)
    );

    if (evento) {
        res.json(evento);
    } else {
        res.status(404).json("Id não encontrado");
    }
};

const buscarCidade = (req, res) => {
    const cidade = req.params.cidade.toLowerCase();

    const resultado = eventos.filter(
        e => e.cidade.toLowerCase() == cidade
    );

    if (resultado.length > 0) {
        res.json(resultado);
    } else {
        res.status(404).json("Cidade não encontrada");
    }
};

const buscarTipoEvento = (req, res) => {
    const tipo = req.params.tipo.toLowerCase();

    const resultado = eventos.filter(
        e => e.tipo_evento.toLowerCase() == tipo
    );

    if (resultado.length > 0) {
        res.json(resultado);
    } else {
        res.status(404).json("Tipo de evento não encontrado");
    }
};

const atualizarEvento = (req, res) => {
    const id = req.params.id;
    const dados = req.body;

    dados.id = Number(id);

    let status = 0;

    eventos.forEach((evento, indice) => {
        if (evento.id == id) {
            eventos[indice] = dados;
            status = 1;
        }
    });

    if (status == 1) {
        res.status(202).json(dados);
    } else {
        res.status(404).send("Evento não encontrado");
    }
};

const excluirEvento = (req, res) => {
    const id = req.params.id;

    let status = 0;

    eventos.forEach((evento, indice) => {
        if (evento.id == id) {
            eventos.splice(indice, 1);
            status = 1;
        }
    });

    if (status == 1) {
        res.json("Evento excluído com sucesso");
    } else {
        res.status(404).send("Evento não encontrado");
    }
};

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const porta = 3000;

app.get("/", (req, res) => {
    res.send("Servidor funcionando! Acesse /eventos para ver os eventos.");
});

app.post("/eventos", cadastrarEvento);
app.get("/eventos", listarEvento);
app.get("/eventos/:id", buscarEvento);
app.get("/eventos/cidade/:cidade", buscarCidade);
app.get("/eventos/tipo/:tipo", buscarTipoEvento);
app.put("/eventos/:id", atualizarEvento);
app.delete("/eventos/:id", excluirEvento);

app.listen(porta, () => {
    console.log(`Servidor respondendo em: http://localhost:${porta}`);
});