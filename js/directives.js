import { emb } from './EmbellishedElements.js';
import EmbellishedElementHelper from './EmbellishedElementHelper.js';

window.Embellisher = (function() {
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
      this.bind();
    },

    bind: function() {
      let _this = this;

      modelElements.each(function(element) {
        let modelName = element.attr(MODEL_NAME);
        element.on('keyup', () => ( bindings[modelName] = element.val() ));

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
            .filter(element => ( element.attr(MODEL_NAME) === modelName && element.get().type ))
            .val(value);

            boundElements
            .filter(element => ( element.attr(BOUND_NAME) === modelName && !element.get().type ))
            .html(value);
          },

          get: () => { return value },

          enumerable: true
        });
      }
    }
  }
})();

window.IconEmbellisher = (function() {
  'use strict';

  return {
    iconElements: [],

    init: function() {
      this.iconElements = emb('[embellished-icon]');

      this.embellishNavigation();
    },

    embellishNavigation() {
      this.iconElements.hasClass('menu').prepend(this.getImageElement('img/icons/menu.svg#icon'));
      this.iconElements.hasClass('share').prepend(this.getImageElement('img/icons/share.svg#icon'));
      this.iconElements.hasClass('search').prepend(this.getImageElement('img/icons/search.svg#icon'));
      this.iconElements.hasClass('add').prepend(this.getImageElement('img/icons/add.svg#icon'));
      this.iconElements.hasClass('clear').prepend(this.getImageElement('img/icons/clear.svg#icon'));
      this.iconElements.hasClass('more').prepend(this.getImageElement('img/icons/more.svg#icon'));
    },

    getImageElement: function(image) {
      return emb(EmbellishedElementHelper.createSVG(image))
      .attr('viewBox', '0 0 24 24')
      .attr('width', '24')
      .attr('height', '24');
    }
  }
})();

window.FormEmbellisher = (function() {
  'use strict';

  const ERROR_CLASS = 'emb-has-error';
  const VALUE_CLASS = 'emb-has-value';

  return {
    formElements: [],

    init: function() {
      this.formElements = emb('[embellished] form, form[embellished]');

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
  Embellisher.init();
  IconEmbellisher.init();
  FormEmbellisher.init();
});