import { emb } from './EmbellishedElements.js';

window.EmbellishedController = (function() {
  'use strict';

  const MODEL_NAME = 'embellisher-model';
  const BOUND_NAME = 'embellisher-bound';
  const MODEL_ATTRIBUTE = `[${MODEL_NAME}]`;
  const BOUND_ATTRIBUTE = `[${BOUND_NAME}]`;

  const modelElements = emb(MODEL_ATTRIBUTE);
  const boundElements = emb(BOUND_ATTRIBUTE);

  let bindings = {};

  return {

    init: function () {
      let _this = this;

      modelElements.each(function(element) {
        let modelName = element.attr(MODEL_NAME);

        element.on('keyup', () => { bindings[modelName] = element.val(); });

        _this.watch(modelName);
      });
    },

    watch: function(modelName) {
      if (!bindings.hasOwnProperty(modelName)) {
        let value;

        Object.defineProperty(bindings, modelName, {
          set: (newValue) => {
            value = (newValue !== null ? newValue : '');

            modelElements
            .filter(element => element.attr(MODEL_NAME) === modelName && element.get().type)
            .val(value);

            boundElements
            .filter(element => element.attr(BOUND_NAME) === modelName && !element.get().type)
            .html(value);
          },

          get: () => { return value; },

          enumerable: true
        });
      }
    }
  }
})();

window.FormEmbellisher = (function() {
  'use strict';

  const ERROR_CLASS = 'emb-has-error';
  const VALUE_CLASS = 'emb-has-value';

  return {
    formElements: null,

    init: function() {
      this.formElements = emb('[embellished] form,'
        + '.embellished form,'
        + 'form[embellished],'
        + 'form.embellished');

      this.addInitialFieldStates();
      this.addListeners();
    },

    addInitialFieldStates: function() {
      this.formElements.children('input').hasVal().addClass(VALUE_CLASS);
    },

    addListeners: function() {
      this.addInputHasValueListener();
      this.addOnSubmitListener();
    },

    addInputHasValueListener: function() {
      this.formElements.children('input').on('blur', function(event) {
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
      })
    },

    addOnSubmitListener: function () {
      this.formElements.on('submit', function(event) {
        event.preventDefault();
        emb(event.target)
        .attr('submitted', '')
        .addClass('submitted')
        .children('input')
          .trigger('blur');
      });
    }
  }
})();

document.addEventListener("DOMContentLoaded", function(event) {
  EmbellishedController.init();
  FormEmbellisher.init();
});