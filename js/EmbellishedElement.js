import { required } from './EmbellishedErrors.js';
import EmbellishedElementHelper from './EmbellishedElementHelper.js';
import EmbellishedElements from './EmbellishedElements.js';
import { EmbellishedError } from './EmbellishedErrors.js';

export default class EmbellishedElement {

  element;
  events = [];
  // errors = [];

  constructor(element = required()) {
    if (element instanceof EmbellishedElement) { return element; }
    if (!(element instanceof HTMLElement) && !(element instanceof Element)) {
      throw new EmbellishedError('EmbellishedElements: Tried to create an Embellished Element from a non-element.');
    }

    this.element = element;
    return this;
  }

  get() {
    return this.element;
  }

  remove() {
    this.parent().removeChild(this.element);
  }

  /*
   **************************************************
   * HTML content
   **************************************************
   */
  create(html) {
    return EmbellishedElementHelper.createElement(html);
  }

  append(html = required()) {
    if (html instanceof EmbellishedElements) { for (let element of html.get()) {this.element.appendChild(element.get()); } return this; }

    let element = html;
    if (html instanceof EmbellishedElement) { element = html.get(); }
    if (typeof html === 'string' && html.startsWith('<')) { element = this.create(html); }

    this.element.append(element);
    return this;
  }

  prepend(html = required()) {
    if (html instanceof EmbellishedElements) { for (let element of html.get()) { this.element.insertBefore(element.get(), this.element.firstChild); } return this; }

    let element = html;
    if (html instanceof EmbellishedElement) { element = html.get(); }
    if (typeof html === 'string' && html.startsWith('<')) { element = this.create(html); }

    this.element.prepend(element);
    return this;
  }

  html(html) {
    if (html === undefined) { return this.element.innerHTML; }
    return this.empty().append(html);
  }

  empty() {
    while (this.element.firstChild) { this.element.removeChild(this.element.firstChild); }
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
    this.unbind(event);
    this.element.addEventListener(event, callback);
    this.events.push( {type: event, event: callback} );

    return this;
  }

  off(event = required()) {
    return this.unbind(event);
  }

  unbind(event = required()) {
    let existing = this.events.find(evt => evt.type === event);
    if (existing !== undefined) { this.element.removeEventListener(event, existing.event); }
    this.events = this.events.filter(evt => evt.type !== event);

    return this;
  }

  trigger(event = required()) {
    let evt = document.createEvent('HTMLEvents');
    evt.initEvent(event, true, false);
    this.element.dispatchEvent(evt);

    return this;
  }


  /*
   **************************************************
   * Errors
   **************************************************
   */
  // error(error) {
  //   this.errors.push( {type: error} )
  // }


  /*
   **************************************************
   * Children
   **************************************************
   */
  children(selector) {
    if (selector === undefined) { return Array.from(this.element.children); }
    return this.find(selector);
  }

  find(selector = required()) {
    return EmbellishedElementHelper.findElements(selector, this.element); // Returns [EmbellishedElement]
  }


  /*
   **************************************************
   * Parent
   **************************************************
   */
  closest(selector = required()) {
    return this.element.closest(selector);
  }

  parent(selector) {
    if (selector === undefined) { return this.element.parentElement; }
    return EmbellishedElementHelper.filterElements([this.element.parentElement], selector);
  }


  /*
   **************************************************
   * Siblings
   **************************************************
   */
  siblings(selector) {
    let siblings = this.parent().children.filter(child => (child !== this.element));
    if (selector === undefined) { return siblings; }

    return EmbellishedElementHelper.filterElements(siblings, selector);
  }

  next(selector) {
    let siblings = [];
    let sibling = this.element;
    while (sibling = sibling.nextElementSibling) { siblings.push(sibling); }

    if (selector === undefined) { return siblings; }

    return EmbellishedElementHelper.filterElements(siblings, selector);
  }

  prev(selector) {
    let siblings = [];
    let sibling = this.element;
    while (sibling = sibling.previousElementSibling) { siblings.push(sibling); }

    if (selector === undefined) { return siblings; }

    return EmbellishedElementHelper.filterElements(siblings, selector);
  }


  /*
   **************************************************
   * CSS classes
   **************************************************
   */
  hasClass(name = required()) {
    return this.element.classList.contains(name);
  }

  addClass(name = required()) {
    this.element.classList.add(name);
    return this;
  }

  removeClass(name = required()) {
    this.element.classList.remove(name);
    return this;
  }

  show() {
    if (this.element.offsetParent === null) { this.element.style.display = ''; }
    return this;
  }

  // fadeIn(speed = 50) {
  //   let style = this.element.style;
  //   style.opacity = 0;
  //   style.display = 'block';
  //
  //   (function fade() { while((style.opacity += .1) <= 1) { setTimeout(fade,speed) } })();
  // }

  hide() {
    if (this.element.offsetParent !== null) { this.element.style.display = 'none'; }
    return this;
  }

  // fadeOut(speed = 50) {
  //   let style = this.element.style;
  //   style.opacity = 1;
  //
  //   (function fade() { (style.opacity -= .1) < .1 ? style.display = 'none' : setTimeout(fade, speed); })();
  // }

  /*
   **************************************************
   * Attributes
   **************************************************
   */
  attr(name = required(), value) {
    if (value === undefined) { return this.element.getAttribute(name); }

    this.element.setAttribute(name, value);
    return this;
  }

  hasAttr(name = required()) {
    return (this.element.getAttribute(name) !== null);
  }

  val(value) {
    if (value === undefined) { return (this.element.value ? this.element.value : null); }

    this.element.value = value;
    return this;
  }
}