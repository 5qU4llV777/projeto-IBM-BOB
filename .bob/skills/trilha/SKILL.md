---
name: trilha
description: Use when the user types /trilha followed by a technology name — reads dio-explorer/data/trilhas.json and returns a structured study plan for that technology.
metadata:
  argument-hint: "[tecnologia]"
---

# /trilha — Plano de Estudos

Siga os passos abaixo sempre que o usuário invocar `/trilha <tecnologia>`.

## Passo 1 — Obter o argumento

O argumento é a tecnologia digitada após `/trilha` (ex: `/trilha Python`).
Se nenhum argumento for fornecido, pergunte ao usuário qual tecnologia deseja estudar usando `ask_followup_question`.

## Passo 2 — Executar o script de busca

Use `execute_command` para rodar o script de busca:

```bash
node .bob/skills/trilha/buscar-trilha.js "<tecnologia>"
```

O script retorna um JSON com as trilhas encontradas ou uma mensagem de erro.

## Passo 3 — Montar o Plano de Estudos

Com base no JSON retornado, gere o plano de estudos no seguinte formato em Markdown:

```
# 📚 Plano de Estudos — <Tecnologia>

## Trilhas Encontradas

Para cada trilha:
### <número>. <titulo>
- **Categoria:** <categoria>
- **Nível:** <nivel>
- **Duração:** <duracao_horas> horas
- **Tecnologias:** <tecnologias separadas por vírgula>

**Descrição:** <descricao>

---

## 🗓️ Cronograma Sugerido

Divida as horas totais em semanas de 10h/semana e apresente um cronograma semanal.

## ✅ Próximos Passos

Liste 3 dicas práticas para o usuário começar a trilha.
```

## Passo 4 — Nenhuma trilha encontrada

Se o script retornar `[]` ou erro, informe que a tecnologia não foi encontrada no catálogo e sugira tecnologias disponíveis listadas no JSON.
