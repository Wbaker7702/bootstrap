import Chip from '../../src/chip.js'
import { clearFixture, getFixture } from '../helpers/fixture.js'

describe('Chip', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  it('should take care of element either passed as a CSS selector or DOM element', () => {
    fixtureEl.innerHTML = '<div class="chip"></div>'

    const chipEl = fixtureEl.querySelector('.chip')
    const chipBySelector = new Chip('.chip')
    const chipByElement = new Chip(chipEl)

    expect(chipBySelector._element).toEqual(chipEl)
    expect(chipByElement._element).toEqual(chipEl)
  })

  it('should return version', () => {
    expect(Chip.VERSION).toEqual(jasmine.any(String))
  })

  describe('DATA_KEY', () => {
    it('should return plugin data key', () => {
      expect(Chip.DATA_KEY).toEqual('bs.chip')
    })
  })

  describe('data-api', () => {
    it('should close a chip without instantiating it manually', () => {
      fixtureEl.innerHTML = [
        '<div class="chip">',
        '  <button type="button" data-bs-dismiss="chip">×</button>',
        '</div>'
      ].join('')

      const button = document.querySelector('button')

      button.click()
      expect(document.querySelectorAll('.chip')).toHaveSize(0)
    })

    it('should close a chip without instantiating it manually with the parent selector', () => {
      fixtureEl.innerHTML = [
        '<div class="chip">',
        '  <button type="button" data-bs-target=".chip" data-bs-dismiss="chip">×</button>',
        '</div>'
      ].join('')

      const button = document.querySelector('button')

      button.click()
      expect(document.querySelectorAll('.chip')).toHaveSize(0)
    })
  })

  describe('close', () => {
    it('should close a chip', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="chip">Label</div>'

        const chipEl = document.querySelector('.chip')
        const chip = new Chip(chipEl)

        chipEl.addEventListener('closed.bs.chip', () => {
          expect(document.querySelectorAll('.chip')).toHaveSize(0)
          resolve()
        })

        chip.close()
      })
    })

    it('should close chip with fade class', () => {
      return new Promise(resolve => {
        fixtureEl.innerHTML = '<div class="chip fade show">Label</div>'

        const chipEl = document.querySelector('.chip')
        const chip = new Chip(chipEl)

        chipEl.addEventListener('transitionend', () => {
          expect().nothing()
        })

        chipEl.addEventListener('closed.bs.chip', () => {
          expect(document.querySelectorAll('.chip')).toHaveSize(0)
          resolve()
        })

        chip.close()
      })
    })

    it('should not remove chip if close event is prevented', () => {
      return new Promise((resolve, reject) => {
        fixtureEl.innerHTML = '<div class="chip">Label</div>'

        const chipEl = document.querySelector('.chip')
        const chip = new Chip(chipEl)

        chipEl.addEventListener('close.bs.chip', event => {
          event.preventDefault()
          setTimeout(() => {
            expect(document.querySelectorAll('.chip')).toHaveSize(1)
            resolve()
          }, 10)
        })

        chipEl.addEventListener('closed.bs.chip', () => {
          reject(new Error('closed event should not be triggered'))
        })

        chip.close()
      })
    })
  })

  describe('dispose', () => {
    it('should dispose a chip', () => {
      fixtureEl.innerHTML = '<div class="chip"></div>'

      const chipEl = fixtureEl.querySelector('.chip')
      const chip = new Chip(chipEl)

      expect(Chip.getInstance(chipEl)).toEqual(chip)

      chip.dispose()

      expect(Chip.getInstance(chipEl)).toBeNull()
    })
  })

  describe('jQueryInterface', () => {
    it('should handle config passed and toggle existing chip', () => {
      fixtureEl.innerHTML = '<div class="chip"></div>'

      const chipEl = fixtureEl.querySelector('.chip')
      const chip = new Chip(chipEl)

      jest.spyOn(chip, 'close')

      Chip.jQueryInterface.call(chipEl, 'close')

      expect(chip.close).toHaveBeenCalled()
    })
  })
})
