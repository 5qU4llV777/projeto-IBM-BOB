#!/usr/bin/env node
/**
 * gerar-desafio.js
 * Gera um desafio de código aleatório baseado no nível informado.
 */

const nivel = (process.argv[2] || "iniciante").toLowerCase();

const desafios = {
  iniciante: [
    {
      enunciado: "Escreva uma função que receba um número inteiro e retorne `true` se ele for par e `false` se for ímpar.",
      entrada: "Um número inteiro (ex: 4)",
      saida: "true (se par) ou false (se ímpar)",
      dica: "Use o operador módulo `%` para verificar o resto da divisão por 2.",
      exemplos: "parOuImpar(4) → true\nparOuImpar(7) → false\nparOuImpar(0) → true"
    },
    {
      enunciado: "Crie uma função que receba uma string e retorne ela invertida.",
      entrada: "Uma string (ex: 'hello')",
      saida: "A string invertida (ex: 'olleh')",
      dica: "Em Python use `[::-1]`. Em JavaScript use `.split('').reverse().join('')`.",
      exemplos: "inverter('DIO') → 'OID'\ninverter('codigo') → 'ogidoc'"
    },
    {
      enunciado: "Escreva uma função que calcule a soma de todos os números de 1 até N.",
      entrada: "Um inteiro positivo N (ex: 5)",
      saida: "A soma 1+2+...+N (ex: 15)",
      dica: "Você pode usar um laço `for` ou a fórmula matemática `N*(N+1)/2`.",
      exemplos: "somaN(5) → 15\nsomaN(10) → 55\nsomaN(1) → 1"
    },
    {
      enunciado: "Crie uma função que verifique se uma palavra é um palíndromo (lida da mesma forma de trás para frente).",
      entrada: "Uma string (ex: 'arara')",
      saida: "true se for palíndromo, false caso contrário",
      dica: "Compare a string original com sua versão invertida.",
      exemplos: "palindromo('arara') → true\npalindromo('dio') → false\npalindromo('ana') → true"
    }
  ],
  intermediário: [
    {
      enunciado: "Implemente uma função que receba um array de inteiros e retorne o segundo maior valor, sem usar `.sort()`.",
      entrada: "Um array de inteiros (ex: [3, 1, 4, 1, 5, 9, 2])",
      saida: "O segundo maior valor do array (ex: 5)",
      dica: "Percorra o array mantendo dois registros: o maior e o segundo maior valor.",
      exemplos: "segundoMaior([3,1,4,1,5,9,2]) → 5\nsegundoMaior([1,2]) → 1"
    },
    {
      enunciado: "Escreva uma função que receba uma frase e retorne a palavra que mais aparece nela.",
      entrada: "Uma string com múltiplas palavras (ex: 'dio dio code dio')",
      saida: "A palavra mais frequente (ex: 'dio')",
      dica: "Use um dicionário/objeto para contar as ocorrências de cada palavra.",
      exemplos: "maisFrequente('dio dio code dio') → 'dio'"
    },
    {
      enunciado: "Crie uma função que implemente o algoritmo de busca binária em um array ordenado.",
      entrada: "Um array ordenado e um valor alvo (ex: [1,3,5,7,9], 5)",
      saida: "O índice do valor no array, ou -1 se não encontrado",
      dica: "Divida o array ao meio a cada iteração e compare com o valor central.",
      exemplos: "buscaBinaria([1,3,5,7,9], 5) → 2\nbuscaBinaria([1,3,5,7,9], 4) → -1"
    }
  ],
  avançado: [
    {
      enunciado: "Implemente um sistema de cache LRU (Least Recently Used) com capacidade configurável usando estruturas de dados adequadas.",
      entrada: "Capacidade do cache e sequência de operações get/put",
      saida: "Resultados das operações get (valor ou -1 se não existir)",
      dica: "Use uma combinação de HashMap + Lista Duplamente Encadeada para obter O(1) em get e put.",
      exemplos: "cache = LRUCache(2)\ncache.put(1,1) → OK\ncache.put(2,2) → OK\ncache.get(1) → 1\ncache.put(3,3) → evict key 2\ncache.get(2) → -1"
    },
    {
      enunciado: "Dado um grafo direcionado representado por lista de adjacência, implemente uma função que detecte se existe ciclo no grafo.",
      entrada: "Um dicionário de adjacências (ex: {0:[1], 1:[2], 2:[0]})",
      saida: "true se houver ciclo, false caso contrário",
      dica: "Use DFS com três estados de coloração: branco (não visitado), cinza (em progresso), preto (concluído).",
      exemplos: "temCiclo({0:[1],1:[2],2:[0]}) → true\ntemCiclo({0:[1],1:[2]}) → false"
    },
    {
      enunciado: "Implemente o algoritmo de compressão Run-Length Encoding (RLE): comprime uma string substituindo sequências repetidas por contagem+caractere.",
      entrada: "Uma string (ex: 'AAABBBCCDDDDEE')",
      saida: "A string comprimida (ex: '3A3B2C4D2E')",
      dica: "Percorra a string contando repetições consecutivas. Se a contagem for 1, omita o número.",
      exemplos: "rle('AAABBBCCDDDDEE') → '3A3B2C4D2E'\nrle('ABCD') → 'ABCD'"
    }
  ]
};

const nivelNormalizado = nivel
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase();

const chave =
  nivelNormalizado === "intermediario"
    ? "intermediário"
    : nivelNormalizado === "avancado"
    ? "avançado"
    : "iniciante";

const lista = desafios[chave] || desafios["iniciante"];
const sorteado = lista[Math.floor(Math.random() * lista.length)];

console.log(JSON.stringify({ nivel: chave, ...sorteado }, null, 2));
