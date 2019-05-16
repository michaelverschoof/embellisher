import { emb } from '../EmbellishedElements.js';
import { required } from '../EmbellishedErrors.js';

const TARGET = 'embellished-icon';
const NAMESPACE_SVG = 'http://www.w3.org/2000/svg';
const NAMESPACE_XLINK = 'http://www.w3.org/1999/xlink';
const ICON_SIZE = '24';

let iconElements = emb(`[${TARGET}]`);

export function IconEmbellisher() {
  for (let icon of iconElements.get()) {
    icon.prepend(getImageElement(
      `img/icons/${icon.attr(TARGET)}.svg#icon`
    ));
  }
}

function getImageElement(image = required()) {
  return emb(createSvg(image))
  .attr('viewBox', `0 0 ${ICON_SIZE} ${ICON_SIZE}`)
  .attr('width', ICON_SIZE)
  .attr('height', ICON_SIZE);
}

function createSvg(image = required()) {
  const svg = document.createElementNS(NAMESPACE_SVG, 'svg');
  svg.appendChild(createUse(image));

  return svg;
}

function createUse(image) {
  const use = document.createElementNS(NAMESPACE_SVG, 'use');
  use.setAttributeNS(NAMESPACE_XLINK, 'href', image);

  return use;
}
