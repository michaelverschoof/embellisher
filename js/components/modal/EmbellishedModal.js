import { required } from '../../EmbellishedErrors.js';
import { emb } from '../../EmbellishedElements.js';

window.embellishedModal = function(title) {
  new EmbellishedModal().setTitle('This is a modal').setMessage('Some descriptive text for a modal').addButton('CLOSE').render();
}

export default class EmbellishedModal {

  parent;
  title;
  message;
  buttons = [];

  constructor(parent = document, title, message, buttons) {
    if (title !== undefined) { this.setTitle(title); }
    if (message !== undefined) { this.setMessage(message); }
    if (buttons instanceof Array) { this.buttons = buttons }

    return this;
  }

  setTitle(title = required()) {
    this.title = title;
    return this;
  }

  setMessage(message = required()) {
    this.message = message;
    return this;
  }

  setButtons(buttons = required()) {
    this.buttons = buttons;
    return this;
  }

  addButton(text = required(), callback) {
    this.buttons.push(
      emb('<button>').addClass('emb-modal-button')
      .on('click', (
        callback !== undefined
          ? callback
          : element => emb(element.target).closest('.emb-modal-container').hide().remove()))
      .html(text));

    return this;
  }

  render() {
    let modal = emb('<div>').addClass('emb-modal-container');
    let content = emb('<div>').addClass('emb-modal-content');

    if (this.title) {
      let title = emb('<h2>').addClass('emb-modal-title').html(this.title);
      content.append(title);
    }

    if (this.message) {
      let message = emb('<div>').addClass('emb-modal-message').html(this.message);
      content.append(message);
    }

    if (this.buttons.length > 0) {
      let buttons = emb('<div>').addClass('emb-modal-buttons');
      for (let button of this.buttons) {
        buttons.append(button);
      }
      content.append(buttons);
    }

    modal.append(content);

    document.body.appendChild(modal.first().get());
  }
}