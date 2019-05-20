import { emb } from '../EmbellishedElements.js';

const APP_BAR = 'embellished-app-bar';

const topBar = emb(`[${APP_BAR}~="top"]`).first();
const bottomBar = emb(`[${APP_BAR}~="bottom"]`).first();

const topBarHeight = topBar.get().offsetHeight;
const bottomBarHeight = bottomBar.get().offsetHeight;

let previousPosition = 0;

export function AppBarEmbellisher() {
  addPaddingToParents();
  addScrollListener();
}

function addPaddingToParents() {
  topBar.parent().style.paddingTop = `${topBarHeight}px`;
  bottomBar.parent().style.paddingBottom = `${bottomBarHeight}px`;
}

function addScrollListener() {
  window.onscroll = () => {
    let currentPosition = window.pageYOffset;
    let top = topBar.get();
    let bottom = bottomBar.get();

    if (currentPosition > 0 && currentPosition > previousPosition
        && top.style.transform === '' && bottom.style.transform === '') {
      top.style.transitionTimingFunction = 'ease-in';
      bottom.style.transitionTimingFunction = 'ease-in';
      top.style.transform = `translateY(-${topBarHeight}px)`;
      bottom.style.transform = `translateY(${bottomBarHeight}px)`;
    } else if ((currentPosition === 0 || currentPosition < previousPosition)
        && top.style.transform !== '' && bottom.style.transform !== '') {
      top.style.transitionTimingFunction = 'ease-out';
      bottom.style.transitionTimingFunction = 'ease-out';
      top.style.transform = '';
      bottom.style.transform = '';
    }

    previousPosition = currentPosition;
  }
}
