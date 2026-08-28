# brk-automacao-front

Frontend (painel/dashboard) da **BRK Automação** — consumo da API em
[`brk-automacao-api`](https://github.com/progbrk/brk-automacao-api) pra exibir dados de
sensores em tempo real, relatórios e gestão de clientes/vendas/assinaturas.

## Stack

- **Angular 22** (standalone components, sem NgModule), builder novo (`@angular/build:application`).
- **CoreUI Free Angular Admin Template** (Bootstrap) como base de layout/UI.
- Padrão de arquitetura inspirado no `rti-front` (referência, não código copiado): um service
  de API por entidade (`services/<entidade>-api/`) com requests/responses tipados, envelope de
  resposta `{ success, message, data }` compatível com o `ResponseBase<T>` do backend, chamadas
  HTTP via `firstValueFrom` (estilo async/await), guarda de rota (`authGuard`) protegendo a área
  logada, token JWT no `localStorage`.

## Rodando localmente

```bash
npm install
npm start          # ng serve, usa src/environments/environment.development.ts
npm run build       # build de produção
```

A API (`brk-automacao-api`) precisa estar rodando e com CORS liberado pra origem do `ng serve`
(porta 4200) — ainda pendente no backend.

## Implementado até aqui

- Login (JWT) contra `POST /api/Login`.
- CRUD de **Clientes** (listagem paginada com busca, criação, edição, exclusão) — primeira
  entidade validada ponta a ponta, mesmo padrão a replicar pras outras 9.
