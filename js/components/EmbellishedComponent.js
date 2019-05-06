import Store from '../state/Store.js';
import { emb } from '../EmbellishedElements.js';

export default class EmbellishedComponent {

  // classes = [];
  element;

  constructor(props = {}) {
    let self = this;

    this.render = this.render || function() {};

    if (props.store instanceof Store) {
      props.store.events.subscribe('stateChange', () => self.render());
    }

    if (props.hasOwnProperty('element')) {
      self.element = emb(props.element);
    }
  }
}