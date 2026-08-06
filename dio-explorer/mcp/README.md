# DIO Explorer — MCP Server

Servidor MCP (Model Context Protocol) que expõe as funcionalidades do DIO Explorer como ferramentas prontas para uso pelo Bob ou qualquer cliente MCP compatível.

## Ferramentas disponíveis

| Ferramenta | Descrição |
|---|---|
| `buscar_trilha` | Busca trilhas por tecnologia, título ou categoria |
| `listar_trilhas` | Lista todas as trilhas (com filtro opcional por categoria) |
| `gerar_desafio` | Gera desafio de código aleatório por nível |
| `gerar_certificado` | Gera certificado de conclusão para um aluno |

## Instalação

```bash
cd dio-explorer/mcp
npm install
npm run build
```

## Uso

### stdio (local — para Bob)

```bash
node dist/index.js
```

### Registrar no Bob (`mcp.json`)

```json
{
  "mcpServers": {
    "dio-explorer": {
      "command": "node",
      "args": ["/caminho/absoluto/para/projeto-IBM-BOB/dio-explorer/mcp/dist/index.js"]
    }
  }
}
```

## Estrutura

```
mcp/
├── src/
│   ├── index.ts      # Servidor principal (bootstrap + registro de tools)
│   ├── tools.ts      # Implementação das ferramentas
│   └── types.ts      # Tipos TypeScript compartilhados
├── dist/             # Saída do build TypeScript (gerado pelo tsc)
├── package.json
├── tsconfig.json
└── README.md
```

## Dependências principais

| Pacote | Versão | Uso |
|---|---|---|
| `@modelcontextprotocol/sdk` | ^0.5.0 | Protocolo MCP |
| `zod` | ^3.22.4 | Validação de schemas de entrada |
| `dotenv` | ^16.3.1 | Variáveis de ambiente |
| `express` | ^4.18.2 | HTTP transport (opcional) |
| `helmet` | ^7.1.0 | Segurança HTTP |
| `jsonwebtoken` | ^9.0.2 | Autenticação JWT |

## Dados

O servidor lê `dio-explorer/data/trilhas.json` para buscar e listar trilhas.  
O arquivo é lido em runtime — não é necessário rebuild ao atualizar o catálogo.
