import EmbellishedElement from './EmbellishedElement.js';
import EmbellishedElementHelper from './EmbellishedElementHelper.js';
import { required } from './EmbellishedErrors.js';
import { EmbellishedError } from './EmbellishedErrors.js';

export function emb(selector = required()) {
  if (selector instanceof EmbellishedElements) { return selector; }
  if (selector instanceof HTMLCollection) { return new EmbellishedElements(Array.from(selector)); }
  if (selector instanceof NodeList) { return new EmbellishedElements(Array.from(selector)); }
  if (selector instanceof EmbellishedElement) { return new EmbellishedElements(Array.of(selector)) }
  if (selector instanceof HTMLElement) { return new EmbellishedElements(Array.of(selector)); }

  if (typeof selector !== 'string') { throw new Error('Selector "' + selector + '" cannot be parsed'); }

  if (selector.startsWith('<')) {
    return new EmbellishedElements(EmbellishedElementHelper.createElement(selector));
  }
  return new EmbellishedElements(EmbellishedElementHelper.findElements(selector));
}

export default class EmbellishedElements {

  elements = [];

  constructor(elements = required()) {
    if (elements === null) { return null; }
    if (elements instanceof EmbellishedElements) { return elements; }
    if (elements instanceof EmbellishedElement) { this.elements.push(elements); return this; }
    if (elements instanceof HTMLElement) { this.elements.push(new EmbellishedElement(elements)); return this; }
    if (!Array.isArray(elements)) { throw new EmbellishedError('EmbellishedElements: Tried to create an Embellished Elements from a non-array.'); }

    for (let element of elements) { this.elements.push(element instanceof EmbellishedElement ? element : new EmbellishedElement(element)); }
    return this;
  }

  each(callback = required()) {
    Array.prototype.forEach.call(this.elements, callback);
  }

  remove() {
    for (let element of this.elements) { element.remove(); }
    this.elements = [];

    return this;
  }

  /*
   **************************************************
   * Get elements
   **************************************************
   */
  get() {
    return this.elements;
  }

  first() {
    return this.elements[0];
  }

  last() {
    return this.elements[this.elements.length - 1];
  }

  filter(filter = required()) {
    if (typeof filter === 'string') {
      this.elements = EmbellishedElementHelper.filterElements(this.elements, filter);
      return this;
    }

    this.elements = this.elements.filter(filter);
    return this;
  }


  /*
   **************************************************
   * HTML content
   **************************************************
   */
  append(html = required()) {
    for (let element of this.elements) { element.append(html); }
    return this;
  }

  prepend(html = required()) {
    for (let element of this.elements) { element.prepend(html); }
    return this;
  }

  html(html) {
    if (html === undefined) { return this.first().html(); }

    for (let element of this.elements) { element.html(html); }
    return this;
  }

  empty() {
    for (let element of this.elements) { element.empty(); }
    return this;
  }


  /*
   **************************************************
   * Events
   **************************************************
   */
  on(event = required(), callback = required()) {
    return this.bind(event, callback);
  }

  bind(event = required(), callback = required()) {
    for (let element of this.elements) { element.bind(event, callback); }
    return this;
  }

  off(event = required()) {
    return this.unbind(event);
  }

  unbind(event = required()) {
    for (let element of this.elements) { element.unbind(event); }
    return this;
  }

  trigger(event = required()) {
    for (let element of this.elements) { element.trigger(event); }
    return this;
  }


  /*
   **************************************************
   * Children
   **************************************************
   */
  children(selector) {
    let children = [];
    for (let element of this.elements) { children = children.concat(element.children(selector)); }
    return EmbellishedElementHelper.embellishElements(children);
  }

  find(selector = required()) {
    let children = [];
    for (let element of this.elements) { children = children.concat(element.find(selector)); }
    return EmbellishedElementHelper.embellishElements(children);
  }


  /*
   **************************************************
   * Parent
   **************************************************
   */
  closest(selector = required()) {
    let parents = [];
    for (let element of this.elements) { let closest = element.closest(selector); if (closest !== null) { parents.push(closest); } }
    return EmbellishedElementHelper.embellishElements(parents);
  }

  parent(selector) {
    let parents = [];
    for (let element of this.elements) { parents = parents.concat(element.parent(selector)); }
    return EmbellishedElementHelper.embellishElements(parents);
  }

  /*
   **************************************************
   * Siblings
   **************************************************
   */
  siblings(selector) {
    let siblings = [];
    for (let element of this.elements) { siblings = siblings.concat(element.siblings(selector)); }
    return EmbellishedElementHelper.embellishElements(siblings);
  }

  next(selector) {
    let siblings = [];
    for (let element of this.elements) { siblings = siblings.concat(element.next(selector)); }
    return EmbellishedElementHelper.embellishElements(siblings);
  }

  prev(selector) {
    let siblings = [];
    for (let element of this.elements) { siblings = siblings.concat(element.prev(selector)); }
    return EmbellishedElementHelper.embellishElements(siblings);
  }


  /*
   **************************************************
   * CSS classes
   **************************************************
   */
  hasClass(name = required()) {
    let filtered = [];
    for (let element of this.elements) { element.hasClass(name) && filtered.push(element); }
    return EmbellishedElementHelper.embellishElements(filtered);
  }

  addClass(name = required()) {
    for (let element of this.elements) { element.addClass(name); }
    return this;
  }

  removeClass(name = required()) {
    for (let element of this.elements) { element.removeClass(name); }
    return this;
  }

  hide() {
    for (let element of this.elements) { element.hide(); }
    return this;
  }

  show() {
    for (let element of this.elements) { element.show(); }
    return this;
  }


  /*
   **************************************************
   * Attributes
   **************************************************
   */
  attr(name = required(), value) {
    if (value === undefined) { return this.first().attr(name); }

    for (let element of this.elements) { element.attr(name, value); }
    return this;
  }

  hasAttr(name = required()) {
    let filtered = [];
    for (let element of this.elements) { element.hasAttr(name) && filtered.push(element); }
    return EmbellishedElementHelper.embellishElements(filtered);
  }

  val(value) {
    if (value === undefined) { return this.first().val(); }

    for (let element of this.elements) { element.val(value); }
    return this;
  }

  hasVal() {
    let filtered = [];
    for (let element of this.elements) { element.val() !== null && element.val() !== '' && filtered.push(element); }
    return EmbellishedElementHelper.embellishElements(filtered);
  }

  hasNoVal() {
    let filtered = [];
    for (let element of this.elements) { (element.val() === null || element.val() !== '') && filtered.push(element); }
    return EmbellishedElementHelper.embellishElements(filtered);
  }

  render(parent = document) {
    for (let element of this.elements) {



      parent.body.appendChild(element.get());
    }
  }
}