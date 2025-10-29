/**
 * --------------------------------------------------------------------------
 * Bootstrap util/component-functions.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import EventHandler from '../dom/event-handler.js'
import SelectorEngine from '../dom/selector-engine.js'
import { isDisabled } from './index.js'

const enableDismissTrigger = (component, method = 'hide') => {
  const clickEvent = `click.dismiss${component.EVENT_KEY}`
  const name = component.NAME

  EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function (event) {
    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault()
    }

    if (isDisabled(this)) {
      return
    }

    const target = SelectorEngine.getElementFromSelector(this) || this.closest(`.${name}`)
    const instance = component.getOrCreateInstance(target)

    // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method
    instance[method]()
  })
}

const getjQueryInterface = (componentClass, options = {}) => {
  const {
    // Whether to pass the element (this) as first argument to the method
    passElement = false,
    // Function to transform config before passing to getOrCreateInstance
    configTransform = null
  } = options

  return function (...args) {
    return this.each(function () {
      const config = args[0]
      const instanceConfig = configTransform ? configTransform(config) : config
      const data = componentClass.getOrCreateInstance(this, instanceConfig)

      if (typeof config !== 'string') {
        return
      }

      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`)
      }

      const methodArgs = passElement ? [this, ...args.slice(1)] : args.slice(1)
      data[config](...methodArgs)
    })
  }
}

export {
  enableDismissTrigger,
  getjQueryInterface
}
