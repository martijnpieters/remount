import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import type { ElementSpec } from './types'

const roots = new Map<HTMLElement, ReactDOM.Root>()

export function mount(
  elSpec: ElementSpec,
  mountPoint: HTMLElement,
  props: {},
  element: HTMLElement | null
): void {
  const reactElement = React.createElement(elSpec.component, props)
  const root = ReactDOM.createRoot(mountPoint)
  roots.set(mountPoint, root)
  root.render(reactElement)
}

/**
 * Updates a custom element by re-rendering its React root.
 */

export function update(
  elSpec: ElementSpec,
  mountPoint: HTMLElement,
  props: {},
  element: HTMLElement | null
): void {
  const reactElement = React.createElement(elSpec.component, props)
  const root = roots.get(mountPoint)
  if (root) root.render(reactElement)
}

/**
 * Unmounts a component.
 */

export function unmount(elSpec: ElementSpec, mountPoint: HTMLElement): void {
  const root = roots.get(mountPoint)
  if (!root) return

  root.unmount()
  roots.delete(mountPoint)
}
