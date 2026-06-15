# Cadastro de Endereço com CEP (React)

Exercício 1.3 — Requisição Assíncrona. Formulário de cadastro de endereço que
preenche os campos automaticamente a partir do CEP, consultando a API pública
[ViaCEP](https://viacep.com.br) de forma assíncrona.

Enunciado: <https://ifpb.github.io/exercises/problems/web-script-address-cep-api/>

## Funcionalidades

- Consulta o CEP no ViaCEP ao sair do campo (`blur`).
- Preenche automaticamente rua, bairro, cidade e estado.
- Máscara `00000-000` no campo de CEP enquanto digita.
- Validação: exibe **"O CEP informado é invalido."** para CEP mal formado ou
  inexistente, destacando o campo.
- Cancela requisições anteriores (`AbortController`) para evitar dados obsoletos.

## Stack

- [React 18](https://react.dev) + [Vite](https://vitejs.dev)
- `fetch` nativo, sem dependências de rede extras.

## Rodando localmente

```bash
npm install
npm run dev      # ambiente de desenvolvimento
npm run build    # gera a versão de produção em dist/
npm run preview  # serve o build de produção localmente
```

## Estrutura

```
src/
  App.jsx              # componente do formulário e estado
  main.jsx             # bootstrap do React
  index.css            # estilos
  services/viaCep.js   # camada de acesso à API (isolada da UI)
```

## Deploy (GitHub Pages)

O deploy é automático via GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml))
a cada push na branch `main`. Basta habilitar **Settings → Pages → Source: GitHub Actions**.
