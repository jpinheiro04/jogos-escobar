const imagens = {
  cima: document.getElementById('redcima'),
  baixo: document.getElementById('redbaixo'),
  esquerda: document.getElementById('redesquerda'),
  direita: document.getElementById('reddireita')
};

let x = 313;
let y = 550;
let ultimaDirecao = 'cima';
let emBatalha = false;
let batalhaConcluida = false;
let hpAliado = 20;
let hpInimigo = 20;
let demoEncerrada = false;

// Sons
const somMapa = document.getElementById('sommapa');
somMapa.volume = 0.1;
const somBatalha = document.getElementById('sombatalha');
somBatalha.volume = 0.1;
const somAtaque = document.getElementById('somAtaque');
somAtaque.volume = 1;

somMapa.loop = true;
somMapa.play();

// Canvas de colisão
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imgMapa = new Image();
imgMapa.src = 'imagens/colisao.png'; // ⚠️ Imagem com caminho branco e colisão preta
imgMapa.onload = () => {
  canvas.width = imgMapa.width;
  canvas.height = imgMapa.height;
  ctx.drawImage(imgMapa, 0, 0);
};
//

function mostrar(direcao) {
  for (let chave in imagens) {
    imagens[chave].style.display = 'none';
    imagens[chave].style.left = x + 'px';
    imagens[chave].style.top = y + 'px';
  }
  imagens[direcao].style.display = 'block';
}

//Verificar colisão por cor
function verificarColisao(novaX, novaY) {
  const larguraPersonagem = 50;
  const alturaPersonagem = 50;

  const centroX = Math.floor(novaX + larguraPersonagem / 2);
  const centroY = Math.floor(novaY + alturaPersonagem / 2);

  const pixel = ctx.getImageData(centroX, centroY, 1, 1).data;
  const r = pixel[0];
  const g = pixel[1];
  const b = pixel[2];
  const a = pixel[3];

  // Branco (255,255,255) = andar | Preto = bloqueia
  const livre = r > 200 && g > 200 && b > 200 && a > 0;

  return livre;
}

document.addEventListener('keydown', (e) => {
  if (emBatalha) return;

  let novaX = x;
  let novaY = y;

  switch (e.key.toLowerCase()) {
    case 'w':
    case 'arrowup':
      novaY -= 4;
      ultimaDirecao = 'cima';
      break;
    case 's':
    case 'arrowdown':
      novaY += 4;
      ultimaDirecao = 'baixo';
      break;
    case 'a':
    case 'arrowleft':
      novaX -= 4;
      ultimaDirecao = 'esquerda';
      break;
    case 'd':
    case 'arrowright':
      novaX += 4;
      ultimaDirecao = 'direita';
      break;
  }

  if (verificarColisao(novaX, novaY)) {
    x = novaX;
    y = novaY;
  }

  mostrar(ultimaDirecao);
  verificarBatalha();
  verificarFimDaDemo();
});

document.addEventListener('keyup', () => {
  if (!emBatalha) mostrar(ultimaDirecao);
});

function verificarBatalha() {
  if (!emBatalha && !batalhaConcluida && x >= 190 && x <= 240 && y >= 170 && y <= 240) {
    iniciarBatalha();
  }
}

function iniciarBatalha() {
  document.getElementById('setaGinasio').style.display = 'none';
  emBatalha = true;
  hpAliado = 20;
  hpInimigo = 20;

  somMapa.pause();
  somMapa.currentTime = 0;
  somBatalha.loop = true;
  somBatalha.play();

  document.getElementById('mapa').classList.add('oculto');
  document.getElementById('batalha').classList.remove('oculto');
  document.getElementById('batalha').classList.add('fade');

  document.getElementById('imgEsquerda').style.display = 'block';
  document.getElementById('imgDireita').style.display = 'block';

  document.getElementById('hpAliado').value = hpAliado;
  document.getElementById('hpInimigo').value = hpInimigo;
}

function ataque(tipo) {
  if (tipo === 'tackle') {
    const somTiro = new Audio('sons/tiro.mp3');
    somTiro.play();

    hpInimigo -= 4;
    hpAliado -= 3;
  } else if (tipo === 'growl') {
    somAtaque.play();
    hpInimigo -= 3;
    hpAliado -= 1;
  }

  if (hpInimigo < 0) hpInimigo = 0;
  if (hpAliado < 0) hpAliado = 0;

  document.getElementById('hpAliado').value = hpAliado;
  document.getElementById('hpInimigo').value = hpInimigo;

  if (hpInimigo === 0) {
    alert("Você venceu!");
    finalizarBatalha();
  } else if (hpAliado === 0) {
    alert("Você perdeu!");
    finalizarBatalha();
  }
}

function finalizarBatalha() {
  emBatalha = false;
  batalhaConcluida = true;

  somBatalha.pause();
  somBatalha.currentTime = 0;
  somMapa.play();

  document.getElementById('batalha').classList.add('oculto');
  document.getElementById('mapa').classList.remove('oculto');

  document.getElementById('imgEsquerda').style.display = 'none';
  document.getElementById('imgDireita').style.display = 'none';

  mostrar(ultimaDirecao);
  document.getElementById('seta').classList.remove('oculto');
}

setTimeout(() => {
  document.getElementById('mensagemMissao').style.display = 'none';
}, 5000);

function verificarFimDaDemo() {
  if (batalhaConcluida && !demoEncerrada && y >= 140 && y <= 380 && x >= 580 && x <= 700) {
    demoEncerrada = true;
    alert("🎉 Fim da Demo! Obrigado por jogar.");
  }
}

mostrar(ultimaDirecao);
