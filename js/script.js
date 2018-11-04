$(document).ready(function() {
	// Obtendo o canvas.
	var canvas = document.getElementById("canvas"),
		contexto = canvas.getContext("2d");

	var gameOver = false,
		pontos = 0;

	// 
	function desenhaPontos() {
	    contexto.fillStyle = "black";
	    contexto.font="12pt Monospace";
	    contexto.fillText(pontos, 5, 20);
	}

	// Objeto cria os Splites para o jogo
	function sprite(srcDaImagem, xInicial, yInicial) {
		this.x = xInicial;
		this.y = yInicial;

		this.imagem = new Image();
		this.imagem.src = srcDaImagem;

		var that = this;
		this.imagem.onload = function() {
			that.largura = that.imagem.width;
			that.altura =  that.imagem.height;
			that.desenhaImagem();
		}

		// Desenha os sprites
		this.desenhaImagem = function() {
			contexto.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
			// contexto.strokeStyle = 'darkred';
			// contexto.lineWidth = 0.2;
			// contexto.strokeRect(this.x, this.y, this.largura, this.altura);
		}

		// Movendo os sprites
		this.move = function(dx, dy) {
			this.x += dx;
			this.y += dy;
			// Limites
			if(	this.x > canvas.width) {
				this.x = -this.largura;
			}else if(this.x < -this.largura) {
				this.x = canvas.width;
			}
			if(this.y > canvas.height - this.altura + 5) {
				this.y -= dy;
			}else if(this.y <= -5) {
				this.y = canvas.height - this.altura;
			}
		}

		// Colisão
		this.colidiu = function(outro) {
			var colidiuNoXTopo = outro.x >= this.x && outro.x <= (this.x + this.largura);
			var colidiuNoYTopo = outro.y >= this.y && outro.y <= (this.y + this.altura);
			var colidiuNoXBase = (outro.x + outro.largura) >= this.x && (outro.x + + outro.largura) <= (this.x + this.largura);
			var colidiuNoYBase = (outro.y + outro.altura) >= this.y && (outro.y + outro.altura) <= (this.y + this.altura);

			return (colidiuNoXTopo && colidiuNoYTopo) || (colidiuNoXBase && colidiuNoYBase);
		}
	}

	var dilminha = new sprite('img/dilminha.png', 320, 400);
	dilminha.passou = function() {
		if(this.y <= 0) {
			this.y = canvas.height - this.altura;
			return true;
		}
		return false;
	}
	var carroAmarelo = new sprite('img/carrinho-amarelo.png', -10, 300);
	var carroAzul = new sprite('img/carrinho-azul.png', 560, 200);
	var carroPolicia = new sprite('img/carrinho-policia.png', 10, 100);

	// Desenhando o fundo do jogo
	function desenhaFundo() {
		// preenchendo o fundo com cinza escuro.
		contexto.fillStyle = 'dimgray';
		contexto.fillRect(0, 0, canvas.width, canvas.height);

		// Calçada Superior
		contexto.fillStyle = 'lightgray';
		contexto.fillRect(0, 0, canvas.width, 80);
	
		// Calçada Inferior
		contexto.fillStyle = 'lightgray';
		contexto.fillRect(0, 380, canvas.width, 100);

		// Faixas da rua.
		contexto.fillStyle = 'White';
		for (var i = 0; i < 25; i++) {
			//Faixa Superior
			contexto.fillRect(i * 30 -5, 185, 20, 4);
			//Faixa Superior
			contexto.fillRect(i * 30 -5, 280, 20, 4);
		}
	}

	// Configurando controle da dilminha.
	document.onkeydown = function(event) {
		if(gameOver) {
			return;
		}

		switch(event.which) {
			case 37: // Seta para Esquerda.
				dilminha.move(-10, 0);
			break;

			case 38: // Seta para Cima.
				dilminha.move(0, -10);
			break;

			case 39: // Seta para Direita.
				dilminha.move(10, 0);
			break;

			case 40: // Seta para Baixo.
				dilminha.move(0, 10);
			break;
		}

		if(dilminha.passou()) {
			pontos++;
		}
	}

	// Repete a função a cada 50 milisegundos.
	setInterval(function() {
		// Desenha o Fundo e Personagens
		desenhaFundo();
		desenhaPontos();
		dilminha.desenhaImagem();
		carroAmarelo.desenhaImagem();
		carroAzul.desenhaImagem();
		carroPolicia.desenhaImagem();

		// Game Over
		if(gameOver) {
			contexto.fillStyle = 'red';
			contexto.font = 'Bold 80px Verdana';
			contexto.fillText('GAME OVER', canvas.width / 16, canvas.height / 2 + 20);

			return;
		}

		// Define o movimento dos carros
		carroAmarelo.move(7, 0);
		carroAzul.move(-5, 0);
		carroPolicia.move(10, 0);

		// Colisão
		if(carroAmarelo.colidiu(dilminha) || carroAzul.colidiu(dilminha) || carroPolicia.colidiu(dilminha)) {
			gameOver = true;
		}
	}, 50);
});