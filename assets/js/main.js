/**
 * Modulazzi — JS do site (sem jQuery, sem dependências externas).
 * Reproduz o comportamento original do tema: menu mobile (hamburger),
 * accordion do FAQ e o botão de WhatsApp (que abre o app/web do WhatsApp
 * em vez de navegar para uma âncora real).
 */
(function () {
  "use strict";

  /* ----------------------------------------------------------------
   * Menu mobile (hamburger)
   * ------------------------------------------------------------- */
  var hamburger = document.querySelector(".hamburger");

  if (hamburger) {
    hamburger.addEventListener("click", function () {
      var nav = hamburger.closest(".flex");
      var wasActive = hamburger.classList.contains("is-active");
      var newFill = wasActive ? "#002346" : "#FFFFFF";

      // O wrapper fixo do header ganha fundo escuro quando o menu abre
      if (nav && nav.parentElement) {
        nav.parentElement.classList.toggle("bg-secondary");
      }

      // Repinta o logo (menos o detalhe verde) de acordo com o estado do menu
      if (nav) {
        nav.querySelectorAll("svg path").forEach(function (path) {
          if (path.getAttribute("fill") !== "#60E66C") {
            path.setAttribute("fill", newFill);
          }
        });
      }

      hamburger.classList.toggle("is-active");

      if (nav) {
        var list = nav.querySelector("ul");
        if (list) {
          list.classList.toggle("hidden");
          list.classList.toggle("flex");
        }
      }
    });

    // Fecha o menu mobile ao clicar em um link (evita ficar aberto ao navegar)
    var navList = hamburger.closest(".flex") && hamburger.closest(".flex").querySelector("ul");
    if (navList) {
      navList.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          if (!navList.classList.contains("hidden") && window.innerWidth < 1024) {
            hamburger.click();
          }
        });
      });
    }
  }

  /* ----------------------------------------------------------------
   * FAQ accordion
   * ------------------------------------------------------------- */
  document.querySelectorAll(".faq").forEach(function (faq) {
    var trigger = faq.querySelector(".flex.justify-between");
    var icon = faq.querySelector("svg");
    var title = faq.querySelector("h4");
    var answer = faq.querySelector("p");

    if (!trigger || !answer) return;

    answer.style.overflow = "hidden";
    answer.style.transition = "max-height .3s ease";

    trigger.addEventListener("click", function () {
      if (icon) icon.classList.toggle("rotate-180");
      if (title) title.classList.toggle("text-primary");

      var isOpen = answer.style.display !== "none";

      if (isOpen) {
        // Fechar: anima até 0 e só então esconde
        answer.style.maxHeight = answer.scrollHeight + "px";
        requestAnimationFrame(function () {
          answer.style.maxHeight = "0px";
        });
        answer.addEventListener("transitionend", function handler() {
          answer.style.display = "none";
          answer.removeEventListener("transitionend", handler);
        });
      } else {
        // Abrir: mostra e anima até a altura do conteúdo
        answer.style.display = "block";
        answer.style.maxHeight = "0px";
        requestAnimationFrame(function () {
          answer.style.maxHeight = answer.scrollHeight + "px";
        });
        answer.addEventListener("transitionend", function handler() {
          answer.style.maxHeight = "none";
          answer.removeEventListener("transitionend", handler);
        });
      }
    });
  });

  /* ----------------------------------------------------------------
   * Botão de WhatsApp — mesmo comportamento do site original:
   * abre o WhatsApp (app em dispositivos móveis, web no desktop)
   * em vez de navegar para "#whatsapp".
   * ------------------------------------------------------------- */
  var WHATSAPP_NUMBER = "+5561992867669";
  var WHATSAPP_MESSAGE =
    "Olá! Eu estava no site e gostaria de mais informações. Pode me ajudar?";

  function isMobileDevice() {
    var ua = navigator.userAgent || navigator.vendor || window.opera || "";
    return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
      ua
    );
  }

  document.querySelectorAll('[href="#whatsapp"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      var base = isMobileDevice()
        ? "https://api.whatsapp.com/send"
        : "https://web.whatsapp.com/send";
      var url =
        base +
        "?phone=" +
        encodeURIComponent(WHATSAPP_NUMBER) +
        "&text=" +
        encodeURIComponent(WHATSAPP_MESSAGE);
      window.open(url, "_blank");
    });
  });

  /* ----------------------------------------------------------------
   * Scroll suave para âncoras internas (quando o alvo existe na página)
   * ------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    var targetId = link.getAttribute("href").slice(1);
    if (link.getAttribute("href") === "#whatsapp") return; // tratado acima
    if (!targetId) return;

    var target = document.getElementById(targetId);
    if (!target) return; // âncora placeholder sem seção correspondente ainda

    link.addEventListener("click", function (event) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();
