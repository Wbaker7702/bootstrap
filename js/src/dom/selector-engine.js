/**
 * --------------------------------------------------------------------------
 * Bootstrap dom/selector-engine.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import { isDisabled, isVisible, parseSelector } from '../util/index.js'

const getSelector = element => {
  let selector = element.getAttribute('data-bs-target')

  if (!selector || selector === '#') {
    let hrefAttribute = element.getAttribute('href')

    // The only valid content that could double as a selector are IDs or classes,
    // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
    // `document.querySelector` will rightfully complain it is invalid.
    // See https://github.com/twbs/bootstrap/issues/32273
    if (!hrefAttribute || (!hrefAttribute.includes('#') && !hrefAttribute.startsWith('.'))) {
      return null
    }

    // Just in case some CMS puts out a full URL with the anchor appended
    if (hrefAttribute.includes('#') && !hrefAttribute.startsWith('#')) {
      hrefAttribute = `#${hrefAttribute.split('#')[1]}`
    }

    selector = hrefAttribute && hrefAttribute !== '#' ? hrefAttribute.trim() : null
  }

  return selector ? selector.split(',').map(sel => parseSelector(sel)).join(',') : null
}

// Cache the focusable elements selector to avoid recreating it on every call
const focusableElementsSelector = [
  'a',
  'button',
  'input',
  'textarea',
  'select',
  'details',
  '[tabindex]',
  '[contenteditable="true"]'
].map(selector => `${selector}:not([tabindex^="-"])`).join(',')

const SelectorEngine = {
  find(selector, element = document.documentElement) {
    // Use Array.from for better performance than spread operator
    return Array.from(Element.prototype.querySelectorAll.call(element, selector))
  },

  findOne(selector, element = document.documentElement) {
    return Element.prototype.querySelector.call(element, selector)
  },

  children(element, selector) {
    // Use Array.from instead of spread operator for better performance
    return Array.from(element.children).filter(child => child.matches(selector))
  },

  parents(element, selector) {
    const parents = []
    // Start from parent and traverse up, avoiding redundant closest() calls
    let ancestor = element.parentNode

    while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE) {
      if (ancestor.matches(selector)) {
        parents.push(ancestor)
      }

      ancestor = ancestor.parentNode
    }

    return parents
  },

  prev(element, selector) {
    let previous = element.previousElementSibling

    while (previous) {
      if (previous.matches(selector)) {
        return [previous]
      }

      previous = previous.previousElementSibling
    }

    return []
  },
  next(element, selector) {
    let next = element.nextElementSibling

    while (next) {
      if (next.matches(selector)) {
        return [next]
      }

      next = next.nextElementSibling
    }

    return []
  },

  focusableChildren(element) {
    return this.find(focusableElementsSelector, element).filter(el => !isDisabled(el) && isVisible(el))
  },

  getSelectorFromElement(element) {
    const selector = getSelector(element)

    if (selector) {
      return SelectorEngine.findOne(selector) ? selector : null
    }

    return null
  },

  getElementFromSelector(element) {
    const selector = getSelector(element)

    return selector ? SelectorEngine.findOne(selector) : null
  },

  getMultipleElementsFromSelector(element) {
    const selector = getSelector(element)

    return selector ? SelectorEngine.find(selector) : []
  }
}

export default SelectorEngine
