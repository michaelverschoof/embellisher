import { emb } from '../EmbellishedElements.js';

const ERROR_CLASS = 'emb-has-error';
const VALUE_CLASS = 'emb-has-value';

let formElements = emb('[embellished] form, form[embellished]');

export function FormEmbellisher() {
  addInitialFieldStates();
  addListeners();
}

function addInitialFieldStates() {
  formElements.children('input').hasVal().addClass(VALUE_CLASS);
}

function addListeners() {
  addInputHasValueListener();
  addOnSubmitListener();
}

function addInputHasValueListener() {
  formElements.children('input').on('blur', function(event) {
    let input = emb(event.target);

    if (input.val()) {
      input.addClass(VALUE_CLASS);
    } else {
      input.removeClass(VALUE_CLASS);
    }

    if (input.closest('form').first().hasClass('submitted')) {
      if (!input.val()) {
        input.addClass(ERROR_CLASS);
      } else {
        // TODO Check if there are no other errors on the element
        input.removeClass(ERROR_CLASS);
      }
    }
  });
}

function addOnSubmitListener() {
  formElements.on('submit', function(event) {
    event.preventDefault();
    emb(event.target)
    .attr('submitted', '')
    .addClass('submitted')
    .children('input')
    .trigger('blur');
  });
}
