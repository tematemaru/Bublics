import 'styles/normalize.scss';

import renderer from './renderer/renderer';

function checkMsiVersion() {
  const ua = window.navigator.userAgent;
  const msie = ua.indexOf('MSIE ');
  const render = document.querySelector('#renderer');

  if (msie > 0) {
    render.style.cssText = 'background: url(/images/bg.png)';
  } else {
    renderer();
  }
  return false;
}

function handleLoad() {
  if (document.querySelector('#renderer').childNodes.length === 0) {
    checkMsiVersion();
  }
}

window.addEventListener('load', handleLoad, false);
