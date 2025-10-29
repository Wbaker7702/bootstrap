/*!
  * Bootstrap component-functions.js v5.3.8 (https://getbootstrap.com/)
  * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('../dom/event-handler.js'), require('../dom/selector-engine.js'), require('./index.js')) :
  typeof define === 'function' && define.amd ? define(['exports', '../dom/event-handler', '../dom/selector-engine', './index'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ComponentFunctions = {}, global.EventHandler, global.SelectorEngine, global.Index));
})(this, (function (exports, EventHandler, SelectorEngine, index_js) { 'use strict';

  /**
   * --------------------------------------------------------------------------
   * Bootstrap util/component-functions.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  const enableDismissTrigger = (component, method = 'hide') => {
    const clickEvent = `click.dismiss${component.EVENT_KEY}`;
    const name = component.NAME;
    EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function (event) {
      if (['A', 'AREA'].includes(this.tagName)) {
        event.preventDefault();
      }
      if (index_js.isDisabled(this)) {
        return;
      }
      const target = SelectorEngine.getElementFromSelector(this) || this.closest(`.${name}`);
      const instance = component.getOrCreateInstance(target);

      // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method
      instance[method]();
    });
  };
  const getjQueryInterface = (componentClass, options = {}) => {
    const {
      // Whether to pass the element (this) as first argument to the method
      passElement = false,
      // Function to transform config before passing to getOrCreateInstance
      configTransform = null
    } = options;
    return function (...args) {
      return this.each(function () {
        const config = args[0];
        const instanceConfig = configTransform ? configTransform(config) : config;
        const data = componentClass.getOrCreateInstance(this, instanceConfig);
        if (typeof config !== 'string') {
          return;
        }
        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
          throw new TypeError(`No method named "${config}"`);
        }
        const methodArgs = passElement ? [this, ...args.slice(1)] : args.slice(1);
        data[config](...methodArgs);
      });
    };
  };

  exports.enableDismissTrigger = enableDismissTrigger;
  exports.getjQueryInterface = getjQueryInterface;

  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

}));
//# sourceMappingURL=component-functions.js.map
