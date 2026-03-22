const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

function alternarMenu() {
  const estaAberto = navLinks.classList.toggle('aberto');
  navToggle.classList.toggle('aberto', estaAberto);
  navToggle.setAttribute('aria-expanded', estaAberto);
}

navToggle.addEventListener('click', alternarMenu);

navLinks.querySelectorAll('.nav-link').forEach(function (link) {
  link.addEventListener('click', function () {
    navLinks.classList.remove('aberto');
    navToggle.classList.remove('aberto');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const todosOsLinks  = document.querySelectorAll('.nav-link');
const todasAsSecoes = document.querySelectorAll('section[id]');

function removerAtivos() {
  todosOsLinks.forEach(function (link) {
    link.classList.remove('ativo');
  });
}

const observadorSecao = new IntersectionObserver(
  function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        const idSecao   = entrada.target.getAttribute('id');
        const linkAtivo = document.querySelector('.nav-link[href="#' + idSecao + '"]');
        if (linkAtivo) {
          removerAtivos();
          linkAtivo.classList.add('ativo');
        }
      }
    });
  },
  {
    threshold: 0.3,
    rootMargin: '-70px 0px 0px 0px'
  }
);

todasAsSecoes.forEach(function (secao) {
  observadorSecao.observe(secao);
});

const formContato     = document.getElementById('formContato');
const campoNome       = document.getElementById('nome');
const campoEmail      = document.getElementById('email');
const campoMensagem   = document.getElementById('mensagem');
const btnEnviar       = document.getElementById('btnEnviar');
const mensagemSucesso = document.getElementById('mensagemSucesso');
const erroNome        = document.getElementById('erroNome');
const erroEmail       = document.getElementById('erroEmail');
const erroMensagem    = document.getElementById('erroMensagem');

var REGEX_EMAIL = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

function mostrarErro(campo, spanErro, mensagem) {
  spanErro.textContent = mensagem;
  campo.classList.add('campo-erro');
  campo.classList.remove('campo-valido');
}

function limparErro(campo, spanErro) {
  spanErro.textContent = '';
  campo.classList.remove('campo-erro');
  campo.classList.add('campo-valido');
}

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

campoNome.addEventListener('blur', validarNome);
campoEmail.addEventListener('blur', validarEmail);
campoMensagem.addEventListener('blur', validarMensagem);

campoNome.addEventListener('input', function () {
  if (campoNome.classList.contains('campo-erro')) validarNome();
});

campoEmail.addEventListener('input', function () {
  if (campoEmail.classList.contains('campo-erro')) validarEmail();
});

campoMensagem.addEventListener('input', function () {
  if (campoMensagem.classList.contains('campo-erro')) validarMensagem();
});

formContato.addEventListener('submit', function (evento) {
  evento.preventDefault();

  var nomeValido     = validarNome();
  var emailValido    = validarEmail();
  var mensagemValida = validarMensagem();

  if (!nomeValido || !emailValido || !mensagemValida) {
    if (!nomeValido)       { campoNome.focus(); }
    else if (!emailValido) { campoEmail.focus(); }
    else                   { campoMensagem.focus(); }
    return;
  }

  var dadosFormulario = {
    nome:     campoNome.value.trim(),
    email:    campoEmail.value.trim(),
    mensagem: campoMensagem.value.trim()
  };

  console.log('Formulário enviado com os dados:', dadosFormulario);

  btnEnviar.disabled    = true;
  btnEnviar.textContent = 'Enviando...';
  mensagemSucesso.hidden = true;

  setTimeout(function () {
    campoNome.value     = '';
    campoEmail.value    = '';
    campoMensagem.value = '';

    [campoNome, campoEmail, campoMensagem].forEach(function (campo) {
      campo.classList.remove('campo-valido', 'campo-erro');
    });

    erroNome.textContent     = '';
    erroEmail.textContent    = '';
    erroMensagem.textContent = '';

    btnEnviar.disabled    = false;
    btnEnviar.textContent = 'Enviar Mensagem';

    mensagemSucesso.hidden = false;
    mensagemSucesso.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(function () {
      mensagemSucesso.hidden = true;
    }, 6000);

  }, 1500);
});

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
