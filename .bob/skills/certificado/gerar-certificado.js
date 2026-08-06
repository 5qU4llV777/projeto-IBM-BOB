#!/usr/bin/env node
/**
 * gerar-certificado.js
 * Gera os dados de um certificado fictício para o usuário.
 */

const nome = process.argv[2];
const trilha = process.argv[3];

if (!nome || !trilha) {
  console.error(JSON.stringify({ erro: "Informe nome e trilha como argumentos." }));
  process.exit(1);
}

const fs = require("fs");
const path = require("path");

// Tenta buscar a carga horária real da trilha
let carga_horaria = 40;
try {
  const dataPath = path.resolve(process.cwd(), "dio-explorer/data/trilhas.json");
  const dados = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const encontrada = dados.trilhas.find((t) =>
    t.titulo.toLowerCase().includes(trilha.toLowerCase()) ||
    t.tecnologias.some((tec) => tec.toLowerCase().includes(trilha.toLowerCase())) ||
    t.categoria.toLowerCase().includes(trilha.toLowerCase())
  );
  if (encontrada) {
    carga_horaria = encontrada.duracao_horas;
  }
} catch (_) {}

// Gera data atual formatada
const agora = new Date();
const data = agora.toLocaleDateString("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric"
});

// Gera código de verificação único
const codigo = "DIO-" +
  Math.random().toString(36).substring(2, 6).toUpperCase() +
  "-" +
  Math.random().toString(36).substring(2, 6).toUpperCase();

console.log(
  JSON.stringify(
    {
      nome,
      trilha,
      data,
      codigo,
      carga_horaria
    },
    null,
    2
  )
);
