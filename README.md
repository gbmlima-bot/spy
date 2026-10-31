# Mira na Cobertura

Jogo de navegador multijogador: um jogador é o sniper, os outros estão numa festa e precisam
cumprir missões antes que o sniper descubra quem é o agente infiltrado.

Jogar: https://gbmlima-bot.github.io/spy/

O site é estático: `index.html` e os arquivos gerados em `assets/`. Os cenários e as animações
são carregados sob demanda; a qualidade visual pode se adaptar ao aparelho. O multijogador roda ponto a ponto entre os navegadores (WebRTC,
via PeerJS); o navegador do anfitrião da sala roda a partida. Não há servidor do jogo.

Para contribuir (fonte em `fonte/mira.html`, build, branches e testes), veja [CONTRIBUTING.md](CONTRIBUTING.md).

Para medir desempenho, ajustar os perfis e validar as mudanças, veja [DESEMPENHO.md](DESEMPENHO.md).
Os resultados e as validações pendentes estão em [RELATORIO-DESEMPENHO.md](RELATORIO-DESEMPENHO.md).
