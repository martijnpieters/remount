/*
 * Adapted from https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs@2.0.4/custom-elements-es5-adapter.js
 * Rolling this in so we don't need another polyfill.
 */

interface ES5AdaptedHTMLElement {
  _babelES5Adapter?: boolean
}

export function inject(): void {
  const w = window as any
  if (
    (w.HTMLElement && w.HTMLElement._babelES5Adapter) ||
    void 0 === w.Reflect ||
    void 0 === w.customElements ||
    w.customElements.hasOwnProperty('polyfillWrapFlushCallback')
  ) {
    return
  }
  const a = HTMLElement

  w.HTMLElement = function(this: HTMLElement) {
    return Reflect.construct(a, [], this.constructor)
  }

  const Adapted = w.HTMLElement as typeof HTMLElement & ES5AdaptedHTMLElement
  Adapted.prototype = a.prototype
  Adapted.prototype.constructor = Adapted
  Object.setPrototypeOf(Adapted, a)
  Adapted._babelES5Adapter = true
}
