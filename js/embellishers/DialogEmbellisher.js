import { emb } from '../EmbellishedElements.js';

const DIALOG = 'embellished-dialog';
const CONTAINER = `${DIALOG}-container`;
const OPEN = `${DIALOG}-open`;
const CLOSE = `${DIALOG}-close`;

let dialogElements = emb(`[embellished] dialog, dialog[embellished], [${DIALOG}]`);
let closeElements = emb(`[${CLOSE}]`);
let openElements = emb(`[${OPEN}]`);
let bodyElement = emb('body');

let scrollPositionHorizontal = 0;
let scrollPositionVertical = 0;

export function DialogEmbellisher() {
  for (let dialog of dialogElements.get()) {
    bodyElement.append(createContainedDialog(dialog));
  }

  closeElements.on('click', (event) => {
    event.preventDefault();
    enableScrolling();

    emb(event.target)
      .removeAttr('open')
      .closest(`[${CONTAINER}]`)
        .hide();
  });

  openElements.on('click', (event) => {
    event.preventDefault();
    disableScrolling();

    const container = emb(`[${CONTAINER}="${getDialogId(event.target)}"]`);

    container
      .show('flex')
      .find(`[${DIALOG}]`)
        .attr('open', '')
        .attr('embellished-dialog-scrollable', (
          container
            .find(`[${DIALOG}] main`)
            .overflowsY()
        ));
  });
}

function createContainedDialog(dialog) {
  let container = createContainerElement(dialog);

  container.on('click', (event) => {
    enableScrolling();
    emb(event.target)
    .attr(CONTAINER) != null
      ? emb(event.target).hide()
      : null
  })
  .prepend(dialog);

  return container;
}

function createContainerElement(dialog) {
  if (emb(dialog.parent()).attr(CONTAINER) != null) { return emb(dialog.parent()); }
  return emb('<div>').attr(CONTAINER, dialog.attr(`${DIALOG}`));
}

function getDialogId(element) {
  return emb(element).closest(`[${OPEN}]`).attr(OPEN);
}

function disableScrolling() {
  scrollPositionHorizontal = window.scrollX;
  scrollPositionVertical= window.scrollY;
  window.addEventListener('scroll', noScrolling);
}

function enableScrolling() {
  window.removeEventListener('scroll', noScrolling);
}

function noScrolling() {
  window.scrollTo(scrollPositionHorizontal, scrollPositionVertical);
}