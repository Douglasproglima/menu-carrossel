var SETTINGS = {
  navBarTravelling: false,
  navBarTravelDirection: "",
  navBarTravelDistance: 150
}

document.documentElement.classList.remove("no-js");
document.documentElement.classList.add("js");

// Botões externos < >
var pnAdvancerLeft = document.getElementById("pnAdvancerLeft");
var pnAdvancerRight = document.getElementById("pnAdvancerRight");
// Indicador
var pnIndicator = document.getElementById("pnIndicator");

var pnProductNav = document.getElementById("pnProductNav");
var pnProductNavContents = document.getElementById("pnProductNavContents");

pnProductNav.setAttribute("data-overflowing", determineOverflow(pnProductNavContents, pnProductNav));

// Seta o indicator
moveIndicator(pnProductNav.querySelector("[aria-selected=\"true\"]"));

// Container Horizontal
var last_known_scroll_position = 0;
var ticking = false;

function doSomething(scroll_pos) {
  pnProductNav.setAttribute("data-overflowing", determineOverflow(pnProductNavContents, pnProductNav));
}

pnProductNav.addEventListener("scroll", function () {
  last_known_scroll_position = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(function () {
      doSomething(last_known_scroll_position);
      ticking = false;
    });
  }
  ticking = true;
});

pnAdvancerLeft.addEventListener("click", function () {
  // Retornar no meio de um movimento 
  if (SETTINGS.navBarTravelling === true)
    return;

  // Se tiver conteúdo transbordando nos dois lados ou à esquerda
  if (determineOverflow(pnProductNavContents, pnProductNav) === "left" || determineOverflow(pnProductNavContents, pnProductNav) === "both") {
    // Verifica até onde o painel foi rolado
    var availableScrollLeft = pnProductNav.scrollLeft;
    // Se o espaço disponível é menor do que dois itens da distância desejada do menu, move o valor total
    // caso contrário, move pela quantidade nas configurações
    if (availableScrollLeft < SETTINGS.navBarTravelDistance * 2)
      pnProductNavContents.style.transform = "translateX(" + availableScrollLeft + "px)";
    else
      pnProductNavContents.style.transform = "translateX(" + SETTINGS.navBarTravelDistance + "px)";

    // Faz uma transição (isso é definida no CSS) quando move, então remove a classe que impede que atualize as configurações
    pnProductNavContents.classList.remove("pn-ProductNav_Contents-no-transition");
    SETTINGS.navBarTravelDirection = "left";
    SETTINGS.navBarTravelling = true;
  }
  // Atualiza o atributo no DOM do HTML
  pnProductNav.setAttribute("data-overflowing", determineOverflow(pnProductNavContents, pnProductNav));
});

pnAdvancerRight.addEventListener("click", function () {
  if (SETTINGS.navBarTravelling === true) {
    return;
  }
  if (determineOverflow(pnProductNavContents, pnProductNav) === "right" || determineOverflow(pnProductNavContents, pnProductNav) === "both") {
    var navBarRightEdge = pnProductNavContents.getBoundingClientRect().right;
    var navBarScrollerRightEdge = pnProductNav.getBoundingClientRect().right;
    var availableScrollRight = Math.floor(navBarRightEdge - navBarScrollerRightEdge);
    if (availableScrollRight < SETTINGS.navBarTravelDistance * 2)
      pnProductNavContents.style.transform = "translateX(-" + availableScrollRight + "px)";
    else
      pnProductNavContents.style.transform = "translateX(-" + SETTINGS.navBarTravelDistance + "px)";

    pnProductNavContents.classList.remove("pn-ProductNav_Contents-no-transition");
    SETTINGS.navBarTravelDirection = "right";
    SETTINGS.navBarTravelling = true;
  }
  pnProductNav.setAttribute("data-overflowing", determineOverflow(pnProductNavContents, pnProductNav));
});

pnProductNavContents.addEventListener(
  "transitionend",
  function () {
    var styleOfTransform = window.getComputedStyle(pnProductNavContents, null);
    var tr = styleOfTransform.getPropertyValue("-webkit-transform") || styleOfTransform.getPropertyValue("transform");
    var amount = Math.abs(parseInt(tr.split(",")[4]) || 0);
    pnProductNavContents.style.transform = "none";
    if (SETTINGS.navBarTravelDirection === "left")
      pnProductNav.scrollLeft = pnProductNav.scrollLeft - amount;
    else
      pnProductNav.scrollLeft = pnProductNav.scrollLeft + amount;

    SETTINGS.navBarTravelling = false;
  },
  false
);

pnProductNavContents.addEventListener("click", function (e) {
  var links = [].slice.call(document.querySelectorAll(".pn-ProductNav_Link"));
  links.forEach(function (item) {
    item.setAttribute("aria-selected", "false");
  })
  e.target.setAttribute("aria-selected", "true");
  moveIndicator(e.target);
});

function moveIndicator(item, color) {
  var textPosition = item.getBoundingClientRect();
  var container = pnProductNavContents.getBoundingClientRect().left;
  var distance = textPosition.left - container;
  pnIndicator.style.transform = "translateX(" + (distance + pnProductNavContents.scrollLeft) + "px) scaleX(" + textPosition.width * 0.01 + ")";
  if (color) {
    pnIndicator.style.backgroundColor = colour;
  }
}

function determineOverflow(content, container) {
  var containerMetrics = container.getBoundingClientRect();
  var containerMetricsRight = Math.floor(containerMetrics.right);
  var containerMetricsLeft = Math.floor(containerMetrics.left);
  var contentMetrics = content.getBoundingClientRect();
  var contentMetricsRight = Math.floor(contentMetrics.right);
  var contentMetricsLeft = Math.floor(contentMetrics.left);
  if (containerMetricsLeft > contentMetricsLeft && containerMetricsRight < contentMetricsRight)
    return "both";
  else if (contentMetricsLeft < containerMetricsLeft)
    return "left";
  else if (contentMetricsRight > containerMetricsRight)
    return "right";
  else
    return "none";
}