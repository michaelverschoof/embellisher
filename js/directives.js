import { emb } from './EmbellishedElements.js';
import { FormEmbellisher } from './embellishers/FormEmbellisher.js';
import { IconEmbellisher } from './embellishers/IconEmbellisher.js';

FormEmbellisher();
IconEmbellisher();

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

document.addEventListener("DOMContentLoaded", function(event) {
  Embellisher.init();
});