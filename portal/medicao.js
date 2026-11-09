/* Medição das páginas do NeuroDados Brasil, como no site da Clínica NeuroBee
   (decisão D7 de 8/11/2026): o Google Analytics 4 e o Microsoft Clarity, com os ids
   que vêm no próprio <script> (data-ga4 e data-clarity). O Google Signals e a
   personalização de anúncios ficam desligados. O NeuroDados não tem formulário;
   o único evento próprio é o download de uma base (nome do arquivo, mais nada).
   O Cloudflare Web Analytics não passa por aqui: a zona injeta o beacon sozinha. */
(function () {
  var script = document.currentScript;
  if (!script) return;
  var ga4 = script.getAttribute('data-ga4') || '';
  var clarity = script.getAttribute('data-clarity') || '';

  if (ga4) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', ga4, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    var g = document.createElement('script');
    g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ga4);
    document.head.appendChild(g);
  }

  if (clarity) {
    window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
    var c = document.createElement('script');
    c.async = true;
    c.src = 'https://www.clarity.ms/tag/' + encodeURIComponent(clarity);
    document.head.appendChild(c);
  }

  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href*="/neurodados/dados/"]') : null;
    if (!a) return;
    var arquivo = a.getAttribute('href').split('/').pop().split('?')[0];
    if (window.gtag) window.gtag('event', 'neurodados_download', { arquivo: arquivo });
    if (clarity && window.clarity) window.clarity('event', 'neurodados_download');
  });
})();
