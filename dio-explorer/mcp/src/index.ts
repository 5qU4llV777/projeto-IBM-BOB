#!/usr/bin/env node
/**
 * index.ts
 * Servidor MCP principal — DIO Explorer
 * API compatível com @modelcontextprotocol/sdk v0.5.0
 * Expõe ferramentas: buscar_trilha, gerar_desafio, gerar_certificado, listar_trilhas
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  buscarTrilha,
  gerarDesafio,
  gerarCertificado,
  listarTrilhas,
} from "./tools.js";

const server = new Server(
  { name: "dio-explorer-mcp-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// ─── Definição das ferramentas ────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "buscar_trilha",
      description:
        "Busca trilhas de estudo no catálogo DIO pelo nome de uma tecnologia, título ou categoria (ex: Java, Python, Front-end).",
      inputSchema: {
        type: "object",
        properties: {
          tecnologia: {
            type: "string",
            description:
              "Nome da tecnologia, linguagem ou categoria a buscar (ex: Java, React, DevOps)",
          },
        },
        required: ["tecnologia"],
      },
    },
    {
      name: "listar_trilhas",
      description:
        "Lista todas as trilhas disponíveis no catálogo DIO. Aceita filtro opcional por categoria.",
      inputSchema: {
        type: "object",
        properties: {
          categoria: {
            type: "string",
            description:
              "Categoria para filtrar (ex: Front-end, Back-end, DevOps, Machine Learning). Omita para listar todas.",
          },
        },
        required: [],
      },
    },
    {
      name: "gerar_desafio",
      description:
        "Gera um desafio de programação aleatório de acordo com o nível de dificuldade informado.",
      inputSchema: {
        type: "object",
        properties: {
          nivel: {
            type: "string",
            enum: ["iniciante", "intermediario", "intermediário", "avancado", "avançado"],
            description:
              "Nível de dificuldade do desafio: iniciante, intermediario ou avancado",
          },
        },
        required: ["nivel"],
      },
    },
    {
      name: "gerar_certificado",
      description:
        "Gera um certificado de conclusão de trilha para o aluno informado, com código de verificação único.",
      inputSchema: {
        type: "object",
        properties: {
          nome: {
            type: "string",
            description: "Nome completo do aluno",
          },
          trilha: {
            type: "string",
            description:
              "Nome da trilha concluída (ex: Java, Python, React). Será buscado no catálogo para obter a carga horária real.",
          },
        },
        required: ["nome", "trilha"],
      },
    },
  ],
}));

// ─── Execução das ferramentas ────────────────────────────────────────────────

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  switch (name) {
    case "buscar_trilha": {
      const tecnologia = String(args["tecnologia"] ?? "");
      return buscarTrilha(tecnologia);
    }
    case "listar_trilhas": {
      const categoria = args["categoria"] ? String(args["categoria"]) : undefined;
      return listarTrilhas(categoria);
    }
    case "gerar_desafio": {
      const nivel = String(args["nivel"] ?? "iniciante");
      return gerarDesafio(nivel);
    }
    case "gerar_certificado": {
      const nome = String(args["nome"] ?? "");
      const trilha = String(args["trilha"] ?? "");
      return gerarCertificado(nome, trilha);
    }
    default:
      return {
        content: [{ type: "text" as const, text: `Ferramenta desconhecida: ${name}` }],
        isError: true,
      };
  }
});

// ─── Bootstrap ───────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("DIO Explorer MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in DIO Explorer MCP Server:", error);
  process.exit(1);
});
