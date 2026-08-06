/**
 * types.ts
 * Tipos TypeScript compartilhados pelo MCP Server DIO Explorer.
 */

import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export interface Trilha {
  id: number;
  titulo: string;
  categoria: string;
  nivel: "Iniciante" | "Intermediário" | "Avançado";
  duracao_horas: number;
  descricao: string;
  tecnologias: string[];
}

export interface TrilhasData {
  trilhas: Trilha[];
}

export interface Desafio {
  nivel: string;
  enunciado: string;
  entrada: string;
  saida: string;
  dica: string;
  exemplos: string;
}

export interface Certificado {
  nome: string;
  trilha: string;
  data: string;
  codigo: string;
  carga_horaria: number;
}

// Alias para o tipo de retorno oficial das tools MCP
export type McpToolResult = CallToolResult;
