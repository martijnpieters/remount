import { define, getStrategy } from './core'
import * as ReactAdapter from './react'
import type { Defaults, ElementMap } from './types'

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

function defineReact(
  components: ElementMap = {},
  options: Defaults = {}
): void {
  return define(components, {
    adapter: ReactAdapter,
    ...options
  })
}

export { defineReact as define, getStrategy }

export type {
  Adapter,
  Component,
  Defaults,
  ElementMap,
  ElementSpec,
  Strategy
} from './types'
