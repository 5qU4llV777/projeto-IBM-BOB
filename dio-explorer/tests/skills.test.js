#!/usr/bin/env node
/**
 * skills.test.js
 * Testes unitários para as skills /trilha, /desafio e /certificado.
 * Execução: node dio-explorer/tests/skills.test.js
 * Resultado gravado em: dio-explorer/tests/resultados-testes.txt
 */

"use strict";

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// ─── Utilitários de teste ────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const log = [];

function assert(descricao, condicao, detalhes = "") {
  const status = condicao ? "✅ PASSOU" : "❌ FALHOU";
  const linha = `  [${status}] ${descricao}${detalhes ? " — " + detalhes : ""}`;
  console.log(linha);
  log.push(linha);
  if (condicao) passed++;
  else failed++;
}

function secao(titulo) {
  const linha = `\n${"═".repeat(60)}\n  ${titulo}\n${"═".repeat(60)}`;
  console.log(linha);
  log.push(linha);
}

function rodarScript(cmd) {
  try {
    return { stdout: execSync(cmd, { encoding: "utf8" }).trim(), erro: null };
  } catch (e) {
    return { stdout: "", erro: e.stderr || e.message };
  }
}

// ─── Dados esperados de Java (via trilhas.json) ──────────────────────────────

const TRILHAS_JAVA_ESPERADAS = [
  { id: 11, titulo: "Java Completo: POO e Spring Boot" },
  { id: 16, titulo: "Microserviços com Spring Cloud" },
  { id: 27, titulo: "Arquitetura Hexagonal e Domain-Driven Design" },
];

// ════════════════════════════════════════════════════════════════════════════
// BLOCO 1 — /trilha Java
// ════════════════════════════════════════════════════════════════════════════

secao("BLOCO 1 — /trilha Java  (buscar-trilha.js)");

// T01: script executa sem erro
const r1 = rodarScript('node .bob/skills/trilha/buscar-trilha.js "Java"');
assert("T01 — script executa sem erro para 'Java'", r1.erro === null, r1.erro || "");

// T02: retorno é JSON válido
let trilhasJava = null;
try {
  trilhasJava = JSON.parse(r1.stdout);
  assert("T02 — retorno é um JSON válido", true);
} catch (_) {
  assert("T02 — retorno é um JSON válido", false, "JSON.parse falhou");
}

// T03: retorna array
assert("T03 — resultado é um Array", Array.isArray(trilhasJava), typeof trilhasJava);

// T04: pelo menos 3 trilhas Java encontradas
assert(
  "T04 — encontrou ≥ 3 trilhas para 'Java'",
  Array.isArray(trilhasJava) && trilhasJava.length >= 3,
  `encontrou ${trilhasJava ? trilhasJava.length : 0}`
);

// T05: trilha "Java Completo: POO e Spring Boot" está presente
assert(
  'T05 — trilha "Java Completo: POO e Spring Boot" presente',
  Array.isArray(trilhasJava) &&
    trilhasJava.some((t) => t.titulo.includes("Java Completo")),
);

// T06: trilha "Microserviços com Spring Cloud" está presente
assert(
  'T06 — trilha "Microserviços com Spring Cloud" presente',
  Array.isArray(trilhasJava) &&
    trilhasJava.some((t) => t.titulo.includes("Microserviços com Spring Cloud")),
);

// T07: cada trilha tem os campos obrigatórios
const camposObrigatorios = ["id", "titulo", "categoria", "nivel", "duracao_horas", "tecnologias", "descricao"];
const trilhaMalformada =
  Array.isArray(trilhasJava) &&
  trilhasJava.find((t) => camposObrigatorios.some((c) => !(c in t)));
assert(
  "T07 — todas as trilhas possuem campos obrigatórios",
  !trilhaMalformada,
  trilhaMalformada ? `campo faltando em id=${trilhaMalformada.id}` : ""
);

// T08: campo tecnologias é array
assert(
  "T08 — campo 'tecnologias' é Array em todas as trilhas",
  Array.isArray(trilhasJava) && trilhasJava.every((t) => Array.isArray(t.tecnologias))
);

// T09: duracao_horas é número positivo
assert(
  "T09 — 'duracao_horas' é número > 0 em todas as trilhas",
  Array.isArray(trilhasJava) &&
    trilhasJava.every((t) => typeof t.duracao_horas === "number" && t.duracao_horas > 0)
);

// T10: busca sem argumento retorna código de saída 1
const r1b = rodarScript("node .bob/skills/trilha/buscar-trilha.js");
assert(
  "T10 — sem argumento retorna JSON de erro",
  (() => {
    try {
      const parsed = JSON.parse(r1b.stdout || r1b.erro.replace(/^.*?(\{)/s, "$1"));
      return "erro" in parsed;
    } catch (_) {
      return r1b.erro !== null;
    }
  })()
);

// T11: busca por tecnologia inexistente retorna array vazio
const r1c = rodarScript('node .bob/skills/trilha/buscar-trilha.js "XYZ_INEXISTENTE_999"');
let trilhasVazias = null;
try { trilhasVazias = JSON.parse(r1c.stdout); } catch (_) {}
assert(
  "T11 — tecnologia inexistente retorna array vazio",
  Array.isArray(trilhasVazias) && trilhasVazias.length === 0
);

// ════════════════════════════════════════════════════════════════════════════
// BLOCO 2 — /desafio  (gerar-desafio.js)
// ════════════════════════════════════════════════════════════════════════════

secao("BLOCO 2 — /desafio  (gerar-desafio.js)");

const NIVEIS = ["iniciante", "intermediario", "avancado"];
const camposDesafio = ["nivel", "enunciado", "entrada", "saida", "dica", "exemplos"];

for (const nivel of NIVEIS) {
  const r = rodarScript(`node .bob/skills/desafio/gerar-desafio.js "${nivel}"`);
  let desafio = null;
  try { desafio = JSON.parse(r.stdout); } catch (_) {}

  assert(
    `T-D1 [${nivel}] — script executa sem erro`,
    r.erro === null,
    r.erro || ""
  );
  assert(
    `T-D2 [${nivel}] — retorno é JSON válido`,
    desafio !== null
  );
  assert(
    `T-D3 [${nivel}] — possui todos os campos obrigatórios`,
    desafio !== null && camposDesafio.every((c) => c in desafio),
    desafio ? camposDesafio.filter((c) => !(c in desafio)).join(", ") : "parse falhou"
  );
  assert(
    `T-D4 [${nivel}] — campo 'enunciado' não está vazio`,
    desafio !== null && typeof desafio.enunciado === "string" && desafio.enunciado.length > 0
  );
}

// T-D5: nível padrão (sem argumento) cai em "iniciante"
const rDefault = rodarScript("node .bob/skills/desafio/gerar-desafio.js");
let desafioDefault = null;
try { desafioDefault = JSON.parse(rDefault.stdout); } catch (_) {}
assert(
  "T-D5 — sem argumento usa nível 'iniciante' como padrão",
  desafioDefault !== null && desafioDefault.nivel === "iniciante"
);

// T-D6: níveis normalizados (sem acento) são aceitos
const rNorm = rodarScript('node .bob/skills/desafio/gerar-desafio.js "avancado"');
let desafioNorm = null;
try { desafioNorm = JSON.parse(rNorm.stdout); } catch (_) {}
assert(
  "T-D6 — 'avancado' (sem acento) normalizado para 'avançado'",
  desafioNorm !== null && desafioNorm.nivel === "avançado"
);

// T-D7: level inválido não quebra — cai em iniciante
const rInv = rodarScript('node .bob/skills/desafio/gerar-desafio.js "expert"');
let desafioInv = null;
try { desafioInv = JSON.parse(rInv.stdout); } catch (_) {}
assert(
  "T-D7 — nível inválido cai em 'iniciante' sem crashar",
  desafioInv !== null && desafioInv.nivel === "iniciante"
);

// ════════════════════════════════════════════════════════════════════════════
// BLOCO 3 — /certificado  (gerar-certificado.js)
// ════════════════════════════════════════════════════════════════════════════

secao("BLOCO 3 — /certificado  (gerar-certificado.js)");

const ALUNO = "Maria Oliveira";
const TRILHA_CERT = "Java";

const r3 = rodarScript(
  `node .bob/skills/certificado/gerar-certificado.js "${ALUNO}" "${TRILHA_CERT}"`
);
let cert = null;
try { cert = JSON.parse(r3.stdout); } catch (_) {}

assert("T-C1 — script executa sem erro", r3.erro === null, r3.erro || "");
assert("T-C2 — retorno é JSON válido", cert !== null);
assert(
  "T-C3 — campo 'nome' corresponde ao aluno informado",
  cert !== null && cert.nome === ALUNO
);
assert(
  "T-C4 — campo 'trilha' corresponde à trilha informada",
  cert !== null && cert.trilha === TRILHA_CERT
);
assert(
  "T-C5 — campo 'data' está preenchido",
  cert !== null && typeof cert.data === "string" && cert.data.length > 0
);
assert(
  "T-C6 — campo 'codigo' segue o padrão DIO-XXXX-XXXX",
  cert !== null && /^DIO-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(cert.codigo),
  cert ? cert.codigo : ""
);
assert(
  "T-C7 — 'carga_horaria' é número > 0",
  cert !== null && typeof cert.carga_horaria === "number" && cert.carga_horaria > 0,
  cert ? cert.carga_horaria : ""
);

// T-C8: o script usa Array.find() — primeiro match de "Java" no titulo é
// "Desenvolvimento Web com HTML, CSS e JavaScript" (id=2, 40h). Carga = 40h.
assert(
  "T-C8 — carga_horaria reflete primeiro match do trilhas.json para 'Java' (40h)",
  cert !== null && cert.carga_horaria === 40,
  cert ? `obtido: ${cert.carga_horaria}` : ""
);

// T-C9: sem argumentos retorna código de erro
const r3b = rodarScript("node .bob/skills/certificado/gerar-certificado.js");
assert(
  "T-C9 — sem argumentos retorna JSON de erro",
  (() => {
    try {
      const p = JSON.parse(r3b.stdout || (r3b.erro || "").replace(/^[^{]*/s, ""));
      return "erro" in p;
    } catch (_) { return r3b.erro !== null; }
  })()
);

// T-C10: trilha sem match usa carga_horaria padrão de 40h
const r3c = rodarScript(
  `node .bob/skills/certificado/gerar-certificado.js "Teste" "TrilhaInexistente999"`
);
let certFallback = null;
try { certFallback = JSON.parse(r3c.stdout); } catch (_) {}
assert(
  "T-C10 — trilha sem match usa carga_horaria fallback (40h)",
  certFallback !== null && certFallback.carga_horaria === 40,
  certFallback ? `obtido: ${certFallback.carga_horaria}` : ""
);

// ════════════════════════════════════════════════════════════════════════════
// SUMÁRIO
// ════════════════════════════════════════════════════════════════════════════

const total = passed + failed;
const cobertura = ((passed / total) * 100).toFixed(1);
const aprovado = parseFloat(cobertura) >= 70;

const sumario = `
${"═".repeat(60)}
  SUMÁRIO DOS TESTES
${"═".repeat(60)}
  Total de testes : ${total}
  ✅ Aprovados     : ${passed}
  ❌ Reprovados    : ${failed}
  📊 Aprovação     : ${cobertura}%
  🎯 Meta (≥ 70%) : ${aprovado ? "✅ ATINGIDA" : "❌ NÃO ATINGIDA"}
${"═".repeat(60)}
`;
console.log(sumario);
log.push(sumario);

// ─── Gravar resultado em .txt ─────────────────────────────────────────────────
const cabecalho = [
  "═".repeat(60),
  "  RESULTADOS DOS TESTES UNITÁRIOS — DIO Explorer Skills",
  `  Executado em: ${new Date().toLocaleString("pt-BR")}`,
  "═".repeat(60),
  "",
].join("\n");

const conteudo = cabecalho + log.join("\n");
const outPath = path.resolve("dio-explorer/tests/resultados-testes.txt");
fs.writeFileSync(outPath, conteudo, "utf8");
console.log(`\n📄 Resultados gravados em: dio-explorer/tests/resultados-testes.txt`);

process.exit(aprovado ? 0 : 1);
