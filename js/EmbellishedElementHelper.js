import { required } from './EmbellishedErrors.js';
import EmbellishedElements from './EmbellishedElements.js';
import EmbellishedElement from './EmbellishedElement.js';
import { EmbellishedError } from './EmbellishedErrors.js';

export default class EmbellishedElementHelper {

  static createElement(selector = required()) {
    let matches = selector.match(/<([\w-]*)>/);
    if (matches === undefined || matches === null) {
      throw new EmbellishedError('Cannot create element. Invalid element structure passed: ' + selector)
    }

    let node = matches[0].replace('<', '').replace('>', '');
    return document.createElement(node);
  }

  static createSVG(image = required()) {
    let use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', image);

    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.appendChild(use);

    return svg;
  }

  static embellishElements(elements) {
    let embellishedElements = [];
    for (let element of elements) { embellishedElements.push(new EmbellishedElement(element)); }
    return new EmbellishedElements(embellishedElements);
  }

  static findElement(selector = required(), parent = document) {
    const node = parent.querySelector(selector);
    return (node instanceof HTMLElement ? node : null);
  }

  static findElements(selector = required(), parent = document) {
    const nodes = parent.querySelectorAll(selector);
    const elements = Array.from(nodes).filter(el => (el instanceof HTMLElement));
    if (elements.length < 1) {
      console.warn('Cannot find any elements with selector "' + selector + '"');
      return null;
    } // TODO Exception?

    return elements;
  }

  static filterElements(elements = required(), selector) {
    const filter = (selector !== undefined ? this.getFilter(selector) : null);
    let filteredElements = [];
    for (let element of elements) { if (!filter || filter(element, selector)) { filteredElements.push(element); } }
    return filteredElements;
  }

  static getFilter(selector = required()) {
    switch (selector.charAt(0)) {
      case '[':
        return this.getAttributeFilter;
      case '.':
        return this.getClassFilter;
      default:
        return this.getElementFilter;
    }
  }

  static getAttributeFilter(element, selector) {
    return element.hasAttribute(selector.replace('[', '').replace(']', ''));
  }

  static getClassFilter(element, selector) {
    return element.classList.contains(selector.replace('.', ''));
  }

  static getElementFilter(element, selector) {
    return element.nodeName.toLowerCase() === selector;
  }

}