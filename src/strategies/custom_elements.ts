import type { ElementEvents, ElementSpec } from '../types'

export const name = 'CustomElements'

/**
 * Registers a custom element.
 *
 * This creates a custom element (ie, a subclass of `window.HTMLElement`) and
 * registers it (ie, `window.customElements.define`).
 *
 * Events will be triggered when something interesting happens.
 *
 * @example
 *     defineElement(
 *       { component: Tooltip },
 *       'x-tooltip',
 *       { onUpdate, onUnmount }
 *     )
 */

export function defineElement(elSpec: ElementSpec, elName: string, events: ElementEvents): void {
  const { onUpdate, onUnmount, onMount } = events
  const attributes = elSpec.attributes || []

  class ComponentElement extends HTMLElement {
    _mountPoint?: HTMLElement

    static get observedAttributes(): string[] {
      return ['props-json', ...attributes]
    }

    connectedCallback(): void {
      this._mountPoint = createMountPoint(this, elSpec)
      onMount(this, this._mountPoint)
    }

    disconnectedCallback(): void {
      if (!this._mountPoint) {
        return
      }
      onUnmount(this, this._mountPoint)
    }

    attributeChangedCallback(): void {
      if (!this._mountPoint) {
        return
      }
      onUpdate(this, this._mountPoint)
    }
  }

  if (elSpec.quiet && window.customElements.get(elName)) {
    return
  }

  window.customElements.define(elName, ComponentElement)
}

export function isSupported(): boolean {
  return !!(window.customElements && window.customElements.define)
}

/**
 * Creates a `<span>` element that serves as the mounting point for React
 * components. If `shadow: true` is requested, it'll attach a shadow node.
 */

function createMountPoint(element: HTMLElement, elSpec: ElementSpec): HTMLElement {
  const { shadow } = elSpec
  if (shadow && element.attachShadow) {
    const mountPoint = document.createElement('span')
    element.attachShadow({ mode: 'open' }).appendChild(mountPoint)
    return mountPoint
  } else {
    return element
  }
}

/**
 * Check if Shadow DOM is supported.
 */

export function supportsShadow(): boolean {
  return !!(document && document.body && document.body.attachShadow)
}
