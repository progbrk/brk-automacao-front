export const environment = {
  production: true,
  // Front e API são servidos pela mesma origem (nginx faz proxy de /api para o
  // container da API) — caminho relativo funciona independente de como o host
  // é acessado (LAN, Tailscale IP ou hostname .ts.net).
  brkAutomacaoApi: '/api'
};
