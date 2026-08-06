---
name: desafio
description: Use when the user types /desafio — generates a random coding challenge based on a chosen difficulty level (Iniciante, Intermediário or Avançado).
metadata:
  argument-hint: "[iniciante|intermediario|avancado]"
---

# /desafio — Desafio de Código Aleatório

Siga os passos abaixo sempre que o usuário invocar `/desafio`.

## Passo 1 — Obter o nível

Verifique se o usuário passou o nível como argumento (ex: `/desafio iniciante`).
Se não passou, use `ask_followup_question` com as opções:
- Iniciante
- Intermediário
- Avançado

## Passo 2 — Executar o script de geração

Use `execute_command` para rodar:

```bash
node .bob/skills/desafio/gerar-desafio.js "<nivel>"
```

O script retorna um objeto JSON com os campos do desafio.

## Passo 3 — Apresentar o desafio

Formate a saída do script no seguinte template Markdown:

```
# ⚔️ Desafio de Código — Nível <Nível>

## 📋 Enunciado
<enunciado>

## 📥 Entrada
<entrada>

## 📤 Saída Esperada
<saida>

## 💡 Dica
<dica>

## 🧪 Exemplos
<exemplos>

---
_Boa sorte! Quando terminar, compartilhe sua solução._
```

## Passo 4 — Após apresentar o desafio

Pergunte ao usuário se deseja:
1. Ver a solução de referência
2. Gerar outro desafio do mesmo nível
3. Aumentar o nível de dificuldade
