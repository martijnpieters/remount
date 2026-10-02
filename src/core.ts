import * as CustomElementsStrategy from './strategies/custom_elements'
import * as MutationObserverStrategy from './strategies/mutation_observer'
import type {
  Component,
  Defaults,
  ElementMap,
  ElementSpec,
  PropertyMap,
  Strategy
} from './types'

/**
 * Cache of the strategy determined by `getStrategy()`.
 */

let cachedStrategy: Strategy | undefined

/**
 * Detect what API can be used.
 *
 * @example
 *     Remount.getStrategy().name
 */

export function getStrategy(): Strategy | undefined {
  if (cachedStrategy) {
    return cachedStrategy
  }

  const StrategyUsed: Strategy | undefined = [
    CustomElementsStrategy,
    MutationObserverStrategy
  ].find(strategy => !!strategy.isSupported())

  if (!StrategyUsed) {
    console.warn(
      "Remount: This browser doesn't support the " +
        'MutationObserver API or the Custom Elements API. Including ' +
        'polyfills might fix this. Remount elements will not work. ' +
        'https://github.com/rstacruz/remount'
    )
  }

  cachedStrategy = StrategyUsed
  return StrategyUsed
}

/**
 * Registers custom elements and links them to React components.
 *
 * @example
 *     define({ 'x-tooltip': Tooltip })
 *
 * @example
 *     define(
 *       { 'x-tooltip': Tooltip },
 *       { attributes: ['title', 'body'] }
 *     )
 */

export function define(components: ElementMap, defaults?: Defaults): void {
  const Strategy = getStrategy()
  if (!Strategy) {
    return
  }

  Object.keys(components).forEach((name: string) => {
    const elSpec: ElementSpec = Object.assign(
      {},
      defaults,
      toElementSpec(components[name])
    )

    const adapter = elSpec.adapter
    if (!adapter) throw new Error('No suitable adapter found')

    Strategy.defineElement(elSpec, name, {
      onMount(element, mountPoint) {
        const props = getProps(element, elSpec.attributes)
        if (elSpec.shadow && elSpec.retarget) {
          adapter.mount(elSpec, mountPoint, props, element)
        } else {
          adapter.mount(elSpec, mountPoint, props, null)
        }
      },

      onUpdate(element, mountPoint) {
        const props = getProps(element, elSpec.attributes)
        adapter.update(elSpec, mountPoint, props, null)
      },

      onUnmount(element, mountPoint) {
        adapter.unmount(elSpec, mountPoint)
      }
    })
  })
}

/**
 * Coerces something into an `ElementSpec` type.
 *
 * @example
 *     toElementSpec(Tooltip)
 *     // => { component: Tooltip }
 *
 *     toElementSpec({ component: Tooltip })
 *     // => { component: Tooltip }
 */

function toElementSpec(thing: ElementSpec | Component): ElementSpec {
  if (isElementSpec(thing)) {
    return thing
  }
  return { component: thing }
}

function isElementSpec(spec: ElementSpec | Component): spec is ElementSpec {
  return typeof spec === 'object' && !!(spec as ElementSpec).component
}

/**
 * Returns properties for a given HTML element.
 *
 * @example
 *     getProps(div, ['name'])
 *     // => { name: 'Romeo' }
 */

function getProps(
  element: HTMLElement,
  attributes: string[] | null | undefined
): PropertyMap {
  const rawJson = element.getAttribute('props-json')
  if (rawJson) {
    return JSON.parse(rawJson)
  }

  const names = attributes || []
  return names.reduce((result: PropertyMap, attribute: string) => {
    result[attribute] = element.getAttribute(attribute)
    return result
  }, {})
}
