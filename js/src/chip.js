/**
 * --------------------------------------------------------------------------
 * Bootstrap chip.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import BaseComponent from './base-component.js'
import EventHandler from './dom/event-handler.js'
import { enableDismissTrigger, getjQueryInterface } from './util/component-functions.js'
import { defineJQueryPlugin } from './util/index.js'

/**
 * Constants
 */

const NAME = 'chip'
const DATA_KEY = 'bs.chip'
const EVENT_KEY = `.${DATA_KEY}`

const EVENT_CLOSE = `close${EVENT_KEY}`
const EVENT_CLOSED = `closed${EVENT_KEY}`
const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_SHOW = 'show'

/**
 * Class definition
 */

class Chip extends BaseComponent {
  // Getters
  static get NAME() {
    return NAME
  }

  // Public
  close() {
    const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE)

    if (closeEvent.defaultPrevented) {
      return
    }

    this._element.classList.remove(CLASS_NAME_SHOW)

    const isAnimated = this._element.classList.contains(CLASS_NAME_FADE)
    this._queueCallback(() => this._destroyElement(), this._element, isAnimated)
  }

  // Private
  _destroyElement() {
    this._element.remove()
    EventHandler.trigger(this._element, EVENT_CLOSED)
    this.dispose()
  }

  // Static
  static jQueryInterface = getjQueryInterface(Chip, { passElement: true })
}

/**
 * Data API implementation
 */

enableDismissTrigger(Chip, 'close')

/**
 * jQuery
 */

defineJQueryPlugin(Chip)

export default Chip
