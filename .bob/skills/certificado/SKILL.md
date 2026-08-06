---
name: certificado
description: Use when the user types /certificado — generates a fictional completion certificate in Markdown with the user's name and completed trail.
metadata:
  argument-hint: "[nome] [trilha]"
---

# /certificado — Certificado Fictício

Siga os passos abaixo sempre que o usuário invocar `/certificado`.

## Passo 1 — Coletar informações

Verifique se o usuário passou nome e trilha como argumento (ex: `/certificado João Python`).

Se faltar o **nome**, use `ask_followup_question` para perguntar.
Se faltar a **trilha**, use `ask_followup_question` para perguntar qual trilha foi concluída — sugira as categorias disponíveis em `dio-explorer/data/trilhas.json`.

## Passo 2 — Executar o script

Use `execute_command` para rodar:

```bash
node .bob/skills/certificado/gerar-certificado.js "<nome>" "<trilha>"
```

O script retorna um JSON com `nome`, `trilha`, `data`, `codigo` e `carga_horaria`.

## Passo 3 — Gerar o certificado em Markdown

Use os dados retornados para montar o certificado no seguinte formato:

```markdown
---

<div align="center">

# 🎓 CERTIFICADO DE CONCLUSÃO

**DIO — Digital Innovation One**

---

Certificamos que

## <NOME DO USUÁRIO>

concluiu com êxito a trilha

## "<NOME DA TRILHA>"

com carga horária de **<carga_horaria> horas**.

---

📅 Data de emissão: <data>
🔑 Código de verificação: <codigo>

_Este certificado foi emitido pela plataforma DIO Explorer._
_Parabéns pela conquista! Continue aprendendo e evoluindo._

</div>

---
```

## Passo 4 — Salvar o certificado (opcional)

Pergunte ao usuário se deseja salvar o certificado como arquivo `.md` em `dio-explorer/docs/`.
Se sim, use `write_file` para salvar em `dio-explorer/docs/certificado-<nome>-<trilha>.md`.
