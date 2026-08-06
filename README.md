# DIO Explorer × IBM Bob

> Servidor MCP customizado + Skills conversacionais que conectam o Bob ao catálogo educacional DIO Explorer — trilhas, desafios e certificados via linguagem natural.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white)
![MCP](https://img.shields.io/badge/MCP-0.5.0-7c5cd8)
![Testes](https://img.shields.io/badge/testes-36%2F36%20✓-2da44e)
![Licença](https://img.shields.io/badge/licença-MIT-57606a)

---

## Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura e Estrutura de Arquivos](#arquitetura-e-estrutura-de-arquivos)
3. [Servidor MCP](#servidor-mcp)
4. [Ferramentas MCP Disponíveis](#ferramentas-mcp-disponíveis)
5. [Skills do Bob](#skills-do-bob)
6. [Prompts — Catálogo Completo](#prompts--catálogo-completo)
7. [Modos de Uso do Bob](#modos-de-uso-do-bob)
8. [Fluxo de Interação](#fluxo-de-interação)
9. [Testes Automatizados](#testes-automatizados)
10. [Configuração e Instalação](#configuração-e-instalação)
11. [Catálogo de Trilhas](#catálogo-de-trilhas)
12. [Dicas de Uso](#dicas-de-uso)
13. [Insights para Futuros Profissionais](#insights-para-futuros-profissionais)

---

## Visão Geral

Este projeto conecta o **IBM Bob** (agente de IA baseado no Model Context Protocol) ao **DIO Explorer**, um catálogo educacional com 30 trilhas de aprendizado, gerador de desafios de código e emissor de certificados fictícios de conclusão.

A integração é feita por meio de um **servidor MCP customizado** escrito em TypeScript que expõe 4 ferramentas, e por **3 Skills** configuradas no Bob que orquestram a experiência conversacional do usuário.

**Objetivo central:** demonstrar, de forma prática, como construir um servidor MCP do zero, registrá-lo no Bob, e criar Skills que transformam ferramentas técnicas em experiências conversacionais ricas para o usuário final.

| Camada | Tecnologia | Responsabilidade |
|---|---|---|
| Agente | IBM Bob (MCP Client) | Interpreta linguagem natural e orquestra ferramentas |
| Protocolo | MCP (Model Context Protocol) | Comunicação estruturada entre agente e servidor |
| Servidor | Node.js + TypeScript | Implementa as ferramentas (tools) do DIO Explorer |
| Dados | JSON flat file | Catálogo de trilhas (`trilhas.json`) |
| Skills | SKILL.md + .js scripts | Comandos `/trilha`, `/desafio`, `/certificado` |

---

## Arquitetura e Estrutura de Arquivos

```
projeto-IBM-BOB/
├── .bob/                          # Configurações do Bob
│   ├── mcp.json                   # Registro do servidor MCP
│   └── skills/
│       ├── trilha/
│       │   ├── SKILL.md           # Instrução da skill /trilha
│       │   └── buscar-trilha.js   # Script Node de busca
│       ├── desafio/
│       │   ├── SKILL.md           # Instrução da skill /desafio
│       │   └── gerar-desafio.js   # Script Node de geração
│       └── certificado/
│           ├── SKILL.md           # Instrução da skill /certificado
│           └── gerar-certificado.js
├── .bobignore                     # Arquivos ignorados pelo Bob
├── README.md                      # Este arquivo
└── dio-explorer/
    ├── data/
    │   └── trilhas.json           # 30 trilhas de aprendizado
    ├── docs/                      # Certificados gerados (opcional)
    ├── mcp/
    │   ├── src/
    │   │   ├── index.ts           # Bootstrap do servidor MCP
    │   │   ├── tools.ts           # Implementação das 4 tools
    │   │   └── types.ts           # Interfaces TypeScript
    │   ├── dist/                  # Build compilado (gerado pelo tsc)
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── README.md
    └── tests/
        ├── skills.test.js         # 36 testes unitários
        └── resultados-testes.txt  # Último resultado dos testes
```

---

## Servidor MCP

O servidor é implementado em TypeScript usando o SDK oficial `@modelcontextprotocol/sdk v0.5.0` e se comunica via **transporte stdio** (stdin/stdout), que é o modo padrão para servidores locais registrados no Bob.

### Registro no Bob (`.bob/mcp.json`)

```json
{
  "mcpServers": {
    "dio-explorer": {
      "command": "node",
      "args": ["/caminho/absoluto/.../dio-explorer/mcp/dist/index.js"]
    }
  }
}
```

> **Por que stdio?** O Bob inicia o processo `node dist/index.js`, troca mensagens JSON pelo pipe e encerra o processo quando a conversa termina. Não requer porta de rede nem autenticação para uso local.

### Dependências principais

| Pacote | Versão | Uso |
|---|---|---|
| `@modelcontextprotocol/sdk` | ^0.5.0 | Protocolo MCP (Server, transport, schemas) |
| `zod` | ^3.22.4 | Validação de schemas de entrada das tools |
| `dotenv` | ^16.3.1 | Variáveis de ambiente |
| `express` | ^4.18.2 | HTTP transport (preparado para uso futuro) |
| `jsonwebtoken` | ^9.0.2 | Autenticação JWT (preparado para uso futuro) |

---

## Ferramentas MCP Disponíveis

O servidor expõe 4 ferramentas que o Bob pode invocar automaticamente ao entender a intenção do usuário.

### `buscar_trilha`

Busca trilhas por nome de tecnologia, título ou categoria. Realiza busca case-insensitive nos campos `titulo`, `categoria` e `tecnologias`.

| Parâmetro | Tipo | Obrigatório | Exemplo |
|---|---|---|---|
| `tecnologia` | string | Sim | `"Java"`, `"Front-end"`, `"React"` |

### `listar_trilhas`

Lista todas as trilhas do catálogo com opção de filtro por categoria.

| Parâmetro | Tipo | Obrigatório | Exemplo |
|---|---|---|---|
| `categoria` | string | Não | `"DevOps"`, `"Back-end"` |

### `gerar_desafio`

Gera um desafio de programação aleatório baseado em nível. Aceita strings com ou sem acento.

| Parâmetro | Tipo | Valores aceitos |
|---|---|---|
| `nivel` | enum | `iniciante` · `intermediario` · `intermediário` · `avancado` · `avançado` |

### `gerar_certificado`

Gera um certificado fictício de conclusão com código de verificação único no padrão `DIO-XXXX-XXXX`. Busca automaticamente a carga horária real da trilha no catálogo.

| Parâmetro | Tipo | Obrigatório |
|---|---|---|
| `nome` | string | Sim — nome completo do aluno |
| `trilha` | string | Sim — nome ou tecnologia da trilha |

---

## Skills do Bob

Skills são extensões do Bob definidas em arquivos `SKILL.md` dentro de `.bob/skills/<nome>/`. Elas mapeiam um **comando de atalho** para uma sequência de passos que o Bob executa: coletar argumentos, rodar scripts e formatar a resposta.

### `/trilha [tecnologia]`

Busca trilhas e monta um **Plano de Estudos completo** com cronograma sugerido e próximos passos.

- **Passo 1:** Obtém o argumento (tecnologia). Se omitido, pergunta ao usuário.
- **Passo 2:** Executa `node .bob/skills/trilha/buscar-trilha.js "<tecnologia>"`
- **Passo 3:** Monta plano em Markdown com cronograma de 10h/semana.
- **Passo 4:** Se não encontrar, sugere tecnologias disponíveis.

### `/desafio [iniciante|intermediario|avancado]`

Gera um desafio aleatório e após o usuário resolver oferece opções de continuar.

- **Passo 1:** Obtém o nível. Se omitido, apresenta 3 opções ao usuário.
- **Passo 2:** Executa `node .bob/skills/desafio/gerar-desafio.js "<nivel>"`
- **Passo 3:** Formata enunciado, entrada, saída esperada, dica e exemplos.
- **Passo 4:** Oferece: ver solução / novo desafio / subir nível.

### `/certificado [nome] [trilha]`

Emite um certificado fictício em Markdown com código de verificação único.

- **Passo 1:** Coleta nome e trilha. Pergunta se algum estiver faltando.
- **Passo 2:** Executa `node .bob/skills/certificado/gerar-certificado.js "<nome>" "<trilha>"`
- **Passo 3:** Formata certificado estilizado em Markdown centralizado.
- **Passo 4:** Oferece salvar o arquivo em `dio-explorer/docs/`.

---

## Prompts — Catálogo Completo

### Comandos de Skill (atalhos diretos)

```
/trilha Python
/trilha React
/trilha Java
/trilha DevOps
/desafio iniciante
/desafio intermediario
/desafio avancado
/certificado João Silva Python
/certificado Maria Oliveira Java
/certificado              ← Bob pergunta nome e trilha
/trilha                   ← Bob pergunta a tecnologia
```

### Linguagem natural — Busca de trilhas

```
Quais trilhas existem de Machine Learning?
Me mostra as trilhas de Front-end disponíveis
Tem alguma trilha de Cloud na DIO?
Quero aprender Docker, por onde começo?
Lista todas as trilhas de Back-end
Quais trilhas existem no catálogo?
Tem trilha de TypeScript?
Quais são as categorias disponíveis?
Qual trilha tem mais horas?
Quero começar do zero, qual trilha você recomenda?
```

### Linguagem natural — Desafios

```
Me dá um desafio de código para iniciante
Quero praticar com um exercício intermediário
Gera um desafio avançado de programação
Outro desafio do mesmo nível
Quero um desafio mais difícil
```

### Linguagem natural — Certificados

```
Gera um certificado para Ana Costa que concluiu React
Quero meu certificado da trilha de Python
Emite um certificado de conclusão de Java para Pedro Lima
```

### Prompts usados durante o desenvolvimento

```
Crie um servidor MCP em TypeScript com as ferramentas buscar_trilha,
listar_trilhas, gerar_desafio e gerar_certificado

Crie a skill /trilha para o Bob que executa um script Node
e monta um plano de estudos

Escreva testes unitários para os scripts das três skills
cobrindo casos de sucesso e falha

Adicione mais desafios ao script gerar-desafio.js nos três níveis

Documente todo o projeto com prompts usados, modos de uso e dicas
```

---

## Modos de Uso do Bob

| Modo | Quando usar | Acesso a tools |
|---|---|---|
| **Agent** | Escrever, modificar, executar código. Usar skills e ferramentas MCP. Implementar features. | Todas — inclui MCP, execute_command, write_file |
| **Plan** | Planejar arquitetura, criar especificações técnicas, decompor problemas antes de codar. | Leitura + MCP (sem execute_command) |
| **Ask** | Perguntas conceituais, entender código existente, recomendações sem modificar nada. | Somente leitura + MCP |

> **Dica:** Para um projeto novo, use **Plan** para arquitetar, **Agent** para implementar e **Ask** para revisar e entender as decisões tomadas.

As skills `/trilha`, `/desafio` e `/certificado` só funcionam no modo **Agent**, pois precisam executar scripts via `execute_command`. As ferramentas MCP estão disponíveis em todos os modos.

---

## Fluxo de Interação

### Via Skill — `/trilha Python`

```
Usuário: /trilha Python
    → Bob ativa SKILL.md
    → execute_command buscar-trilha.js "Python"
    → Script filtra trilhas.json
    → Bob formata plano de estudos em Markdown
```

### Via Ferramenta MCP — linguagem natural

```
Usuário: "quais trilhas de Front-end existem?"
    → Bob decide: listar_trilhas({ categoria: "Front-end" })
    → Chamada MCP via stdio
    → tools.ts filtra JSON
    → Bob formata e apresenta a resposta
```

### Via Ferramenta MCP — certificado

```
Usuário: "certif. para Ana Costa, trilha React"
    → Bob decide: gerar_certificado({ nome: "Ana Costa", trilha: "React" })
    → tools.ts busca carga horária real no catálogo
    → Gera código único DIO-XXXX-XXXX
    → Bob exibe certificado formatado
```

---

## Testes Automatizados

O projeto conta com **36 testes unitários** cobrindo as 3 skills, com foco em comportamentos de sucesso, borda e falha.

```
Total de testes : 36
✅ Aprovados     : 36
❌ Reprovados    : 0
📊 Aprovação     : 100.0%
🎯 Meta (≥ 70%) : ✅ ATINGIDA
```

### Cobertura por bloco

| Bloco | Testes | O que cobre |
|---|---|---|
| Bloco 1 — /trilha | T01 – T11 (11 testes) | Execução do script, JSON válido, array, campos obrigatórios, busca sem argumento, tecnologia inexistente |
| Bloco 2 — /desafio | T-D1 – T-D7 (15 testes) | 3 níveis × 4 asserts + nível padrão, normalização de acento, nível inválido com fallback |
| Bloco 3 — /certificado | T-C1 – T-C10 (10 testes) | Execução, JSON válido, nome/trilha corretos, data preenchida, padrão do código, carga horária real e fallback |

### Como executar

```bash
node dio-explorer/tests/skills.test.js
```

O resultado é gravado automaticamente em `dio-explorer/tests/resultados-testes.txt`.

---

## Configuração e Instalação

### Pré-requisitos

- Node.js ≥ 18
- npm ≥ 9
- IBM Bob instalado e configurado

### Passo a passo

```bash
# 1. Clone o repositório
git clone <url-do-repo> projeto-IBM-BOB
cd projeto-IBM-BOB

# 2. Instale as dependências do MCP server
cd dio-explorer/mcp
npm install

# 3. Compile o TypeScript
npm run build

# 4. Ajuste o caminho absoluto em .bob/mcp.json
# (substitua pelo caminho real na sua máquina)

# 5. Execute os testes para validar
cd ../..
node dio-explorer/tests/skills.test.js
```

### `.bobignore`

Arquivo que instrui o Bob a ignorar certos caminhos ao indexar o projeto:

```
node_modules
.env
caches
certificados gerados
docs/
*.tmp
```

---

## Catálogo de Trilhas

30 trilhas cobrindo 15 categorias e 3 níveis de dificuldade.

| ID | Título | Categoria | Nível | Horas |
|---|---|---|---|---|
| 1 | Fundamentos de Python | Programação | Iniciante | 20h |
| 2 | Desenvolvimento Web com HTML, CSS e JavaScript | Front-end | Iniciante | 40h |
| 3 | React do Zero ao Avançado | Front-end | Intermediário | 60h |
| 4 | Back-end com Node.js e Express | Back-end | Intermediário | 50h |
| 5 | Banco de Dados SQL com PostgreSQL | Banco de Dados | Iniciante | 25h |
| 6 | DevOps com Docker e Kubernetes | DevOps | Avançado | 70h |
| 7 | Cloud Computing com AWS | Cloud | Intermediário | 55h |
| 8 | Machine Learning com Scikit-learn | Inteligência Artificial | Intermediário | 45h |
| 9 | Deep Learning com TensorFlow | Inteligência Artificial | Avançado | 80h |
| 10 | Desenvolvimento Mobile com Flutter | Mobile | Intermediário | 60h |
| 11 | Java Completo: POO e Spring Boot | Back-end | Intermediário | 75h |
| 12 | Segurança da Informação e Ethical Hacking | Segurança | Avançado | 65h |
| 13 | Engenharia de Dados com Apache Spark | Data Engineering | Avançado | 70h |
| 14 | TypeScript para Desenvolvedores JavaScript | Programação | Intermediário | 30h |
| 15 | Angular: Framework Front-end Corporativo | Front-end | Intermediário | 55h |
| 16 | Microserviços com Spring Cloud | Arquitetura | Avançado | 65h |
| 17 | Data Science com Python | Ciência de Dados | Intermediário | 50h |
| 18 | Git e GitHub para Iniciantes | Ferramentas | Iniciante | 15h |
| 19 | Vue.js 3: Composição e Reatividade | Front-end | Intermediário | 45h |
| 20 | CI/CD com GitHub Actions | DevOps | Intermediário | 30h |
| 21 | MongoDB e NoSQL para Desenvolvedores | Banco de Dados | Iniciante | 25h |
| 22 | Kotlin para Android | Mobile | Intermediário | 55h |
| 23 | Inteligência Artificial Generativa com LLMs | Inteligência Artificial | Avançado | 40h |
| 24 | Linux Essencial para Desenvolvedores | Infraestrutura | Iniciante | 20h |
| 25 | C# e .NET: Desenvolvimento Completo | Back-end | Intermediário | 70h |
| 26 | Power BI para Análise de Dados | Business Intelligence | Iniciante | 30h |
| 27 | Arquitetura Hexagonal e Domain-Driven Design | Arquitetura | Avançado | 50h |
| 28 | Terraform e Infraestrutura como Código | DevOps | Avançado | 45h |
| 29 | Testes Automatizados com Jest e Cypress | Qualidade de Software | Intermediário | 35h |
| 30 | Blockchain e Web3 para Desenvolvedores | Blockchain | Avançado | 60h |

---

## Dicas de Uso

**Use os atalhos direto.**
`/trilha Python` é mais rápido que perguntar em linguagem natural. O resultado é o mesmo, mas o atalho vai direto ao ponto sem etapas de interpretação.

**A busca é ampla por design.**
Buscar `"Java"` retorna 9 trilhas porque o termo aparece em títulos (*JavaScript*), tecnologias (*Java*) e outros campos. Para mais especificidade use: `"Spring Boot"`, `"Java Completo"`, `"Node.js"`.

**Salve o certificado.**
Após gerar, peça ao Bob para salvar em `dio-explorer/docs/`. O arquivo ficará como referência permanente com o código de verificação único.

**Escale a dificuldade dos desafios.**
Comece com `/desafio iniciante`, resolva, e peça "aumenta o nível". O Bob gera o próximo desafio no nível intermediário sem precisar redigitar o comando.

**Use o modo Ask para explorar sem modificar.**
No modo Ask, perguntas como "explica a arquitetura do servidor MCP" ou "quais tecnologias abrange a categoria DevOps?" funcionam perfeitamente — o Bob lê os arquivos e responde sem modificar nada.

**Atualize o catálogo sem rebuild.**
Edite `dio-explorer/data/trilhas.json` para adicionar novas trilhas. O servidor lê o arquivo em runtime — não precisa recompilar o TypeScript.

---

## Insights para Futuros Profissionais

**1. MCP transforma IA de conversa em agente funcional.**
O Model Context Protocol é a ponte que permite ao LLM chamar código real. Sem ele, o agente apenas "fala sobre" o catálogo. Com ele, o agente "age sobre" — busca, filtra, gera, salva. Dominar MCP é uma das habilidades mais valorizadas em IA aplicada de 2025 em diante.

**2. Skills são a UX das ferramentas de IA.**
Uma ferramenta MCP bem escrita é código. Uma Skill bem escrita é produto. O mesmo `buscar_trilha` pode ser invocado via linguagem natural ou via `/trilha`. A Skill adiciona guia de uso, formato de saída e interação progressiva — isso é design de produto, não só engenharia.

**3. Dados simples, lógica simples — evite over-engineering.**
O catálogo é um único arquivo JSON. A busca é um simples `Array.filter()` com `includes()`. Não há banco de dados, índice invertido ou Redis. Para 30 registros, isso é exatamente certo. Adicione complexidade quando os dados — não as suposições — justificarem.

**4. Teste os scripts que o agente executa, não só o agente.**
O Bob orquestra, mas os scripts Node são o código que realmente roda. Os 36 testes cobrem os scripts diretamente — sem o Bob no meio. Isso garante que o comportamento fundamental é confiável independente de como o agente interpreta o comando.

**5. Normalização de input é fundamental em agentes de IA.**
O usuário pode digitar `"avancado"`, `"avançado"`, `"Avançado"` ou `"AVANCADO"`. O código normaliza via `.normalize("NFD").replace(/[\u0300-\u036f]/g, "")`. Em IA conversacional, nunca assuma que o input chegará no formato perfeito — escreva código defensivo.

**6. TypeScript + MCP SDK = contrato claro entre ferramentas.**
O arquivo `types.ts` define interfaces para `Trilha`, `Desafio`, `Certificado` e `McpToolResult`. Isso cria um contrato que o compilador verifica em build time — erros aparecem antes do deploy, não em produção. Tipos são documentação executável.

**7. O prompt certo economiza horas de código.**
A documentação deste projeto, os testes, as Skills, o servidor MCP — tudo foi construído em iterações de prompt com o Bob. Saber descrever *o que você quer* com precisão (contexto + objetivo + restrições) é tão importante quanto saber programar. O engenheiro do futuro é também um comunicador preciso.

**8. Stdio é suficiente para começar. HTTP é para quando você precisar escalar.**
O servidor usa stdio — zero configuração de rede, zero autenticação. O projeto já tem `express`, `helmet` e `jsonwebtoken` instalados: a infraestrutura para HTTP com JWT está pronta para quando precisar servir múltiplos clientes simultaneamente. Construa simples, evolua quando necessário.

**9. Agentes de IA são produtos, não demos.**
Este projeto tem testes (qualidade), documentação (manutenibilidade), separação de camadas (arquitetura), tratamento de erros (resiliência) e design pensado para o usuário final (UX). É a diferença entre um notebook de experimentação e um produto que outro desenvolvedor pode usar, manter e evoluir.

**10. Construa para quem vem depois de você.**
Todo arquivo neste projeto tem comentários explicando *por quê*, não só *o quê*. O `SKILL.md` de cada skill detalha cada passo. Código sem contexto é um débito técnico. Contexto bem escrito é um presente para o próximo desenvolvedor — que pode ser você mesmo em 6 meses.

---

*Feito com IBM Bob — Digital Innovation One*
