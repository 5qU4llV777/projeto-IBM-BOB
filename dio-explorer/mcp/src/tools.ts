/**
 * tools.ts
 * Implementação das ferramentas expostas pelo MCP Server DIO Explorer.
 * Cada função retorna McpToolResult compatível com o protocolo MCP.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import type { Trilha, TrilhasData, Desafio, Certificado, McpToolResult } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Caminho absoluto para trilhas.json (dois níveis acima de mcp/src/)
const TRILHAS_PATH = resolve(__dirname, "../../data/trilhas.json");

function carregarTrilhas(): TrilhasData {
  const raw = readFileSync(TRILHAS_PATH, "utf8");
  return JSON.parse(raw) as TrilhasData;
}

// ─────────────────────────────────────────────────────────────────────────────
// Ferramenta: buscar_trilha
// ─────────────────────────────────────────────────────────────────────────────

export function buscarTrilha(tecnologia: string): McpToolResult {
  try {
    const dados = carregarTrilhas();
    const termo = tecnologia.toLowerCase();

    const encontradas = dados.trilhas.filter((t) => {
      const emTecnologias = t.tecnologias.some((tec) =>
        tec.toLowerCase().includes(termo)
      );
      const emTitulo = t.titulo.toLowerCase().includes(termo);
      const emCategoria = t.categoria.toLowerCase().includes(termo);
      return emTecnologias || emTitulo || emCategoria;
    });

    if (encontradas.length === 0) {
      const todas = dados.trilhas.map((t) => t.titulo).join(", ");
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              encontradas: [],
              mensagem: `Nenhuma trilha encontrada para "${tecnologia}". Disponíveis: ${todas}`,
            }),
          },
        ],
      };
    }

    return {
      content: [{ type: "text", text: JSON.stringify(encontradas, null, 2) }],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ erro: `Erro ao buscar trilhas: ${String(error)}` }),
        },
      ],
      isError: true,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Ferramenta: gerar_desafio
// ─────────────────────────────────────────────────────────────────────────────

const DESAFIOS: Record<string, Desafio[]> = {
  iniciante: [
    {
      nivel: "iniciante",
      enunciado:
        "Escreva uma função que receba um número inteiro e retorne `true` se ele for par e `false` se for ímpar.",
      entrada: "Um número inteiro (ex: 4)",
      saida: "true (se par) ou false (se ímpar)",
      dica: "Use o operador módulo `%` para verificar o resto da divisão por 2.",
      exemplos: "parOuImpar(4) → true\nparOuImpar(7) → false\nparOuImpar(0) → true",
    },
    {
      nivel: "iniciante",
      enunciado: "Crie uma função que receba uma string e retorne ela invertida.",
      entrada: "Uma string (ex: 'hello')",
      saida: "A string invertida (ex: 'olleh')",
      dica: "Em Python use `[::-1]`. Em JavaScript use `.split('').reverse().join('')`.",
      exemplos: "inverter('DIO') → 'OID'\ninverter('codigo') → 'ogidoc'",
    },
    {
      nivel: "iniciante",
      enunciado: "Escreva uma função que calcule a soma de todos os números de 1 até N.",
      entrada: "Um inteiro positivo N (ex: 5)",
      saida: "A soma 1+2+...+N (ex: 15)",
      dica: "Você pode usar um laço `for` ou a fórmula matemática `N*(N+1)/2`.",
      exemplos: "somaN(5) → 15\nsomaN(10) → 55\nsomaN(1) → 1",
    },
  ],
  "intermediário": [
    {
      nivel: "intermediário",
      enunciado:
        "Implemente uma função que receba um array de inteiros e retorne o segundo maior valor, sem usar `.sort()`.",
      entrada: "Um array de inteiros (ex: [3, 1, 4, 1, 5, 9, 2])",
      saida: "O segundo maior valor do array (ex: 5)",
      dica: "Percorra o array mantendo dois registros: o maior e o segundo maior valor.",
      exemplos: "segundoMaior([3,1,4,1,5,9,2]) → 5\nsegundoMaior([1,2]) → 1",
    },
    {
      nivel: "intermediário",
      enunciado:
        "Crie uma função que implemente o algoritmo de busca binária em um array ordenado.",
      entrada: "Um array ordenado e um valor alvo (ex: [1,3,5,7,9], 5)",
      saida: "O índice do valor no array, ou -1 se não encontrado",
      dica: "Divida o array ao meio a cada iteração e compare com o valor central.",
      exemplos: "buscaBinaria([1,3,5,7,9], 5) → 2\nbuscaBinaria([1,3,5,7,9], 4) → -1",
    },
  ],
  avançado: [
    {
      nivel: "avançado",
      enunciado:
        "Implemente um sistema de cache LRU (Least Recently Used) com capacidade configurável usando estruturas de dados adequadas.",
      entrada: "Capacidade do cache e sequência de operações get/put",
      saida: "Resultados das operações get (valor ou -1 se não existir)",
      dica: "Use uma combinação de HashMap + Lista Duplamente Encadeada para obter O(1) em get e put.",
      exemplos:
        "cache = LRUCache(2)\ncache.put(1,1) → OK\ncache.get(1) → 1\ncache.put(3,3) → evict key 2\ncache.get(2) → -1",
    },
    {
      nivel: "avançado",
      enunciado:
        "Implemente o algoritmo de compressão Run-Length Encoding (RLE).",
      entrada: "Uma string (ex: 'AAABBBCCDDDDEE')",
      saida: "A string comprimida (ex: '3A3B2C4D2E')",
      dica: "Percorra a string contando repetições consecutivas.",
      exemplos: "rle('AAABBBCCDDDDEE') → '3A3B2C4D2E'\nrle('ABCD') → 'ABCD'",
    },
  ],
};

export function gerarDesafio(nivel: string): McpToolResult {
  const nivelNorm = nivel
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const chave =
    nivelNorm === "intermediario"
      ? "intermediário"
      : nivelNorm === "avancado"
      ? "avançado"
      : "iniciante";

  const lista = DESAFIOS[chave] ?? DESAFIOS["iniciante"];
  const sorteado = lista[Math.floor(Math.random() * lista.length)];

  return {
    content: [{ type: "text", text: JSON.stringify(sorteado, null, 2) }],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Ferramenta: gerar_certificado
// ─────────────────────────────────────────────────────────────────────────────

export function gerarCertificado(nome: string, trilha: string): McpToolResult {
  if (!nome || !trilha) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ erro: "Informe nome e trilha como argumentos." }),
        },
      ],
      isError: true,
    };
  }

  let carga_horaria = 40;
  try {
    const dados = carregarTrilhas();
    const encontrada = dados.trilhas.find(
      (t) =>
        t.titulo.toLowerCase().includes(trilha.toLowerCase()) ||
        t.tecnologias.some((tec) => tec.toLowerCase().includes(trilha.toLowerCase())) ||
        t.categoria.toLowerCase().includes(trilha.toLowerCase())
    );
    if (encontrada) {
      carga_horaria = encontrada.duracao_horas;
    }
  } catch (_) {
    // mantém o valor padrão
  }

  const data = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const codigo =
    "DIO-" +
    Math.random().toString(36).substring(2, 6).toUpperCase() +
    "-" +
    Math.random().toString(36).substring(2, 6).toUpperCase();

  const certificado: Certificado = { nome, trilha, data, codigo, carga_horaria };

  return {
    content: [{ type: "text", text: JSON.stringify(certificado, null, 2) }],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Ferramenta: listar_trilhas
// ─────────────────────────────────────────────────────────────────────────────

export function listarTrilhas(categoria?: string): McpToolResult {
  try {
    const dados = carregarTrilhas();
    const lista = categoria
      ? dados.trilhas.filter((t) =>
          t.categoria.toLowerCase().includes(categoria.toLowerCase())
        )
      : dados.trilhas;

    const resumo = lista.map((t) => ({
      id: t.id,
      titulo: t.titulo,
      categoria: t.categoria,
      nivel: t.nivel,
      duracao_horas: t.duracao_horas,
      tecnologias: t.tecnologias,
    }));

    return {
      content: [{ type: "text", text: JSON.stringify(resumo, null, 2) }],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ erro: `Erro ao listar trilhas: ${String(error)}` }),
        },
      ],
      isError: true,
    };
  }
}
