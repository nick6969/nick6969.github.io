(function () {
  'use strict';

  function initTypewriter() {
    var logo = document.querySelector('.sidebar-logo');
    if (!logo) return;

    var fullText = logo.dataset.text || 'NICK\nBLOG';
    logo.textContent = '';
    logo.style.visibility = 'visible';

    var chars = fullText.split('');
    var i = 0;

    var interval = setInterval(function () {
      var ch = chars[i];
      if (ch === '\n') {
        logo.appendChild(document.createElement('br'));
      } else {
        logo.appendChild(document.createTextNode(ch));
      }
      i++;
      if (i >= chars.length) {
        clearInterval(interval);
        revealVersion();
      }
    }, 90);
  }

  function revealVersion() {
    var version = document.querySelector('.sidebar-version');
    if (!version) return;
    version.style.transition = 'opacity 0.5s ease';
    version.style.opacity = '1';
    setTimeout(initGlitch, 200);
  }

  function initGlitch() {
    var logo = document.querySelector('.sidebar-logo');
    if (!logo) return;

    setInterval(function () {
      logo.classList.add('glitch-active');
      setTimeout(function () {
        logo.classList.remove('glitch-active');
      }, 180);
    }, 4000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTypewriter);
  } else {
    initTypewriter();
  }
})();
