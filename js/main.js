/**
 * main.js — Scripts do Portfólio — Thaís Rodeiro
 * Tecnologia: JavaScript puro (ES6+), sem jQuery ou bibliotecas externas
 *
 * Responsabilidades:
 *  1. Menu hambúrguer (abrir/fechar em mobile)
 *  2. Destaque do link ativo na navegação conforme scroll
 *  3. Validação do formulário de contato
 *  4. Simulação de envio (limpa campos + exibe confirmação)
 */

/* ============================================================
   SEÇÃO 1 — MENU HAMBÚRGUER
   Controla abertura/fechamento do menu em telas pequenas
   ============================================================ */

/** Referências aos elementos do menu */
const navToggle  = document.getElementById('navToggle');
const navLinks   = document.getElementById('navLinks');

/**
 * Alterna o estado do menu mobile (aberto/fechado).
 * Adiciona/remove a classe "aberto" e atualiza o atributo
 * aria-expanded para acessibilidade.
 */
function alternarMenu() {
  const estaAberto = navLinks.classList.toggle('aberto');
  navToggle.classList.toggle('aberto', estaAberto);
  navToggle.setAttribute('aria-expanded', estaAberto);
}

/* Escuta o clique no botão hambúrguer */
navToggle.addEventListener('click', alternarMenu);

/**
 * Fecha o menu automaticamente quando o usuário clica
 * em qualquer link de navegação (evita menu preso aberto).
 */
navLinks.querySelectorAll('.nav-link').forEach(function (link) {
  link.addEventListener('click', function () {
    navLinks.classList.remove('aberto');
    navToggle.classList.remove('aberto');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ============================================================
   SEÇÃO 2 — DESTAQUE DO LINK ATIVO NA NAVEGAÇÃO
   Usa IntersectionObserver para detectar qual seção está
   visível e destacar o link correspondente no menu.
   ============================================================ */

/** Coleta todos os links de navegação e todas as seções */
const todosOsLinks  = document.querySelectorAll('.nav-link');
const todasAsSecoes = document.querySelectorAll('section[id]');

/**
 * Remove a classe "ativo" de todos os links de navegação.
 */
function removerAtivos() {
  todosOsLinks.forEach(function (link) {
    link.classList.remove('ativo');
  });
}

/**
 * IntersectionObserver — dispara quando uma seção entra ou sai
 * da área visível do viewport. Marca o link correspondente como ativo.
 */
const observadorSecao = new IntersectionObserver(
  function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        /* Seção atual está visível — busca o link correspondente pelo href */
        const idSecao  = entrada.target.getAttribute('id');
        const linkAtivo = document.querySelector('.nav-link[href="#' + idSecao + '"]');

        if (linkAtivo) {
          removerAtivos();
          linkAtivo.classList.add('ativo');
        }
      }
    });
  },
  {
    /* A seção é considerada "visível" quando ocupa pelo menos 30% da tela */
    threshold: 0.3,
    /* Compensa o navbar fixo de 70px */
    rootMargin: '-70px 0px 0px 0px'
  }
);

/* Registra cada seção no observer */
todasAsSecoes.forEach(function (secao) {
  observadorSecao.observe(secao);
});

/* ============================================================
   SEÇÃO 3 — VALIDAÇÃO DO FORMULÁRIO DE CONTATO
   Valida os campos individualmente e exibe mensagens de erro.
   ============================================================ */

/** Referências ao formulário e seus campos */
const formContato    = document.getElementById('formContato');
const campoNome      = document.getElementById('nome');
const campoEmail     = document.getElementById('email');
const campoMensagem  = document.getElementById('mensagem');
const btnEnviar      = document.getElementById('btnEnviar');
const mensagemSucesso = document.getElementById('mensagemSucesso');

/** Referências às mensagens de erro de cada campo */
const erroNome      = document.getElementById('erroNome');
const erroEmail     = document.getElementById('erroEmail');
const erroMensagem  = document.getElementById('erroMensagem');

/**
 * Expressão regular para validar formato de e-mail.
 * Aceita: usuario@dominio.extensao (ex.: joao@gmail.com)
 */
var REGEX_EMAIL = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

/**
 * Exibe uma mensagem de erro em um campo específico.
 * Adiciona a classe "campo-erro" e remove "campo-valido".
 *
 * @param {HTMLElement} campo   - O input ou textarea
 * @param {HTMLElement} spanErro - O elemento <span> de erro
 * @param {string}      mensagem - Texto da mensagem de erro
 */
function mostrarErro(campo, spanErro, mensagem) {
  spanErro.textContent = mensagem;
  campo.classList.add('campo-erro');
  campo.classList.remove('campo-valido');
}

/**
 * Remove a mensagem de erro de um campo (estado válido).
 * Adiciona a classe "campo-valido" e remove "campo-erro".
 *
 * @param {HTMLElement} campo   - O input ou textarea
 * @param {HTMLElement} spanErro - O elemento <span> de erro
 */
function limparErro(campo, spanErro) {
  spanErro.textContent = '';
  campo.classList.remove('campo-erro');
  campo.classList.add('campo-valido');
}

/**
 * Valida o campo NOME.
 * Regras: não pode ser vazio; mínimo de 3 caracteres.
 *
 * @returns {boolean} true se válido, false se inválido
 */
function validarNome() {
  var valor = campoNome.value.trim();

  if (valor === '') {
    mostrarErro(campoNome, erroNome, 'O nome é obrigatório.');
    return false;
  }

  if (valor.length < 3) {
    mostrarErro(campoNome, erroNome, 'O nome deve ter pelo menos 3 caracteres.');
    return false;
  }

  limparErro(campoNome, erroNome);
  return true;
}

/**
 * Valida o campo E-MAIL.
 * Regras: não pode ser vazio; deve ter formato válido (regex).
 *
 * @returns {boolean} true se válido, false se inválido
 */
function validarEmail() {
  var valor = campoEmail.value.trim();

  if (valor === '') {
    mostrarErro(campoEmail, erroEmail, 'O e-mail é obrigatório.');
    return false;
  }

  if (!REGEX_EMAIL.test(valor)) {
    mostrarErro(campoEmail, erroEmail, 'Informe um e-mail válido (ex.: nome@dominio.com).');
    return false;
  }

  limparErro(campoEmail, erroEmail);
  return true;
}

/**
 * Valida o campo MENSAGEM.
 * Regras: não pode ser vazio; mínimo de 10 caracteres.
 *
 * @returns {boolean} true se válido, false se inválido
 */
function validarMensagem() {
  var valor = campoMensagem.value.trim();

  if (valor === '') {
    mostrarErro(campoMensagem, erroMensagem, 'A mensagem é obrigatória.');
    return false;
  }

  if (valor.length < 10) {
    mostrarErro(campoMensagem, erroMensagem, 'A mensagem deve ter pelo menos 10 caracteres.');
    return false;
  }

  limparErro(campoMensagem, erroMensagem);
  return true;
}

/* --------------------------------------------------------
   Validação em tempo real — feedback imediato ao usuário
   enquanto ele digita ou sai de um campo (evento "blur").
   -------------------------------------------------------- */
campoNome.addEventListener('blur', validarNome);
campoEmail.addEventListener('blur', validarEmail);
campoMensagem.addEventListener('blur', validarMensagem);

/* Remove o erro quando o usuário começa a corrigir o campo */
campoNome.addEventListener('input', function () {
  if (campoNome.classList.contains('campo-erro')) {
    validarNome();
  }
});

campoEmail.addEventListener('input', function () {
  if (campoEmail.classList.contains('campo-erro')) {
    validarEmail();
  }
});

campoMensagem.addEventListener('input', function () {
  if (campoMensagem.classList.contains('campo-erro')) {
    validarMensagem();
  }
});

/* ============================================================
   SEÇÃO 4 — SIMULAÇÃO DE ENVIO DO FORMULÁRIO
   Executa ao submeter o formulário:
     1. Valida todos os campos
     2. Exibe feedback de "enviando..."
     3. Simula atraso de rede (setTimeout)
     4. Limpa os campos
     5. Exibe mensagem de confirmação
   ============================================================ */

formContato.addEventListener('submit', function (evento) {
  /* Previne o envio padrão do HTML (que recarregaria a página) */
  evento.preventDefault();

  /* Valida todos os campos e verifica se todos são válidos */
  var nomeValido     = validarNome();
  var emailValido    = validarEmail();
  var mensagemValida = validarMensagem();

  /* Se qualquer campo for inválido, interrompe o envio */
  if (!nomeValido || !emailValido || !mensagemValida) {
    /* Move o foco para o primeiro campo com erro */
    if (!nomeValido)        { campoNome.focus(); }
    else if (!emailValido)  { campoEmail.focus(); }
    else                    { campoMensagem.focus(); }
    return;
  }

  /* ---- TODOS OS CAMPOS VÁLIDOS — SIMULA O ENVIO ---- */

  /* Coleta os dados (apenas para log — não há envio real) */
  var dadosFormulario = {
    nome:     campoNome.value.trim(),
    email:    campoEmail.value.trim(),
    mensagem: campoMensagem.value.trim()
  };

  /* Log no console para fins didáticos */
  console.log('Formulário enviado com os dados:', dadosFormulario);

  /* Desabilita o botão e exibe texto de carregamento */
  btnEnviar.disabled    = true;
  btnEnviar.textContent = 'Enviando...';

  /* Esconde eventual mensagem de sucesso anterior */
  mensagemSucesso.hidden = true;

  /**
   * Simula o tempo de resposta de uma requisição ao servidor
   * usando setTimeout de 1,5 segundos.
   * Em um projeto real, aqui seria feita uma requisição fetch/XHR.
   */
  setTimeout(function () {

    /* Limpa todos os campos do formulário */
    campoNome.value      = '';
    campoEmail.value     = '';
    campoMensagem.value  = '';

    /* Remove os estados de validação visual */
    [campoNome, campoEmail, campoMensagem].forEach(function (campo) {
      campo.classList.remove('campo-valido', 'campo-erro');
    });

    /* Limpa as mensagens de erro */
    erroNome.textContent      = '';
    erroEmail.textContent     = '';
    erroMensagem.textContent  = '';

    /* Restaura o botão de envio */
    btnEnviar.disabled    = false;
    btnEnviar.textContent = 'Enviar Mensagem';

    /* Exibe a mensagem de confirmação de sucesso */
    mensagemSucesso.hidden = false;

    /* Rola suavemente até a mensagem de sucesso */
    mensagemSucesso.scrollIntoView({ behavior: 'smooth', block: 'center' });

    /**
     * Esconde automaticamente a mensagem de sucesso após 6 segundos,
     * para não poluir a interface indefinidamente.
     */
    setTimeout(function () {
      mensagemSucesso.hidden = true;
    }, 6000);

  }, 1500); /* Simula 1,5s de tempo de resposta do servidor */

});

/* ============================================================
   SEÇÃO 5 — INICIALIZAÇÃO
   Executada quando o script é carregado (DOM já está pronto
   pois o <script> está no final do <body>).
   ============================================================ */

/**
 * Garante que a página inicie na seção correta se houver
 * um hash na URL (ex.: thais-rodeiro.html#portfolio).
 * O CSS scroll-padding-top já compensa o navbar, então
 * apenas reforçamos o estado ativo do link correspondente.
 */
(function inicializar() {
  var hashAtual = window.location.hash;
  if (hashAtual) {
    var linkCorrespondente = document.querySelector('.nav-link[href="' + hashAtual + '"]');
    if (linkCorrespondente) {
      removerAtivos();
      linkCorrespondente.classList.add('ativo');
    }
  }
})();
