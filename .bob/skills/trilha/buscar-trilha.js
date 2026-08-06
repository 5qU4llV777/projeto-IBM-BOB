#!/usr/bin/env node
/**
 * buscar-trilha.js
 * Recebe uma tecnologia como argumento e retorna as trilhas correspondentes
 * do arquivo dio-explorer/data/trilhas.json
 */

const fs = require("fs");
const path = require("path");

const tecnologia = process.argv[2];

if (!tecnologia) {
  console.error(JSON.stringify({ erro: "Informe o nome da tecnologia." }));
  process.exit(1);
}

const dataPath = path.resolve(process.cwd(), "dio-explorer/data/trilhas.json");

let dados;
try {
  dados = JSON.parse(fs.readFileSync(dataPath, "utf8"));
} catch (e) {
  console.error(JSON.stringify({ erro: "Não foi possível ler trilhas.json: " + e.message }));
  process.exit(1);
}

const termo = tecnologia.toLowerCase();

const encontradas = dados.trilhas.filter((t) => {
  const emTecnologias = t.tecnologias.some((tec) =>
    tec.toLowerCase().includes(termo)
  );
  const emTitulo = t.titulo.toLowerCase().includes(termo);
  const emCategoria = t.categoria.toLowerCase().includes(termo);
  return emTecnologias || emTitulo || emCategoria;
});

console.log(JSON.stringify(encontradas, null, 2));
