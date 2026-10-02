import each from '../each'
import type { ElementEvents, ElementSpec, ObserverList } from '../types'

export const name = 'MutationObserver'

/**
 * List of observers tags.
 */

export const observers: ObserverList = {}

export function isSupported(): boolean {
  return 'MutationObserver' in window
}

/**
 * Defines a custom element.
 *
 * @example
 *     defineElement(
 *       { component: MyComponent },
 *       'my-div',
 *       {
 *         onMount: () => {},
 *         onUpdate: () => {},
 *         onUnmount: () => {},
 *       }
 *     )
 */

export function defineElement(
  elSpec: ElementSpec,
  elName: string,
  events: ElementEvents
): void {
  elName = elName.toLowerCase()

  // Maintain parity with what would happen in Custom Elements mode
  if (!isValidName(elName)) {
    if (elSpec.quiet) {
      return
    }
    throw new Error(`Remount: "${elName}" is not a valid custom element elName`)
  }

  if (observers[elName]) {
    if (elSpec.quiet) {
      return
    }
    throw new Error(`Remount: "${elName}" is already registered`)
  }

  const observer = new MutationObserver(mutations => {
    each(mutations, mutation => {
      each(mutation.addedNodes, node => {
        if (isElement(node)) {
          checkForMount(node, elName, events)
        }
      })
    })
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })

  observers[elName] = observer

  function mountElementsInDOM(): void {
    const nodes = document.getElementsByTagName(elName)
    each(nodes, node => {
      if (isElement(node)) {
        checkForMount(node, elName, events)
      }
    })
  }

  if (
    document.readyState === 'complete' ||
    document.readyState === 'interactive'
  ) {
    mountElementsInDOM()
  } else {
    window.addEventListener('DOMContentLoaded', mountElementsInDOM)
  }
}

/**
 * Checks if this new element should fire an `onUpdate` hook.
 * Recurses down to its descendant nodes.
 *
 */

function checkForMount(
  node: HTMLElement,
  elName: string,
  events: ElementEvents
): void {
  if (node.nodeName.toLowerCase() === elName) {
    events.onMount(node, node)
    observeForUpdates(node, events)
    observeForRemoval(node, events)
  } else if (node.children && node.children.length) {
    each(node.children, subnode => {
      if (isElement(subnode)) {
        checkForMount(subnode, elName, events)
      }
    })
  }
}

/**
 * Observes for any changes in attributes.
 */

function observeForUpdates(node: Element, events: ElementEvents): void {
  const { onUpdate } = events
  const observer = new MutationObserver(mutations => {
    each(mutations, mutation => {
      const targetNode = mutation.target
      if (isElement(targetNode)) {
        onUpdate(targetNode, targetNode)
      }
    })
  })

  observer.observe(node, { attributes: true })
}

/**
 * Observes a node's parent to wait until the node is removed
 */

function observeForRemoval(node: HTMLElement, events: ElementEvents): void {
  const { onUnmount } = events
  const parent = node.parentNode

  if (!parent) {
    return
  }

  const observer = new MutationObserver(mutations => {
    each(mutations, mutation => {
      each(mutation.removedNodes, subnode => {
        if (node !== subnode) {
          return
        }
        if (isElement(node)) {
          observer.disconnect()
          onUnmount(node, node)
        }
      })
    })
  })

  observer.observe(parent, { childList: true, subtree: true })
}

/**
 * Validate a custom tag.
 *
 * Since Remount can work with either Custom Elements or MutationObserver API's,
 * it'd be wise if we rejected element names that won't work in Custom Elements
 * mode (even if we're using MutationObserver mode).
 *
 * @example
 *     isValidName('div')      // => false
 *     isValidName('my-div')   // => true
 *     isValidName('123-456')  // => false
 *     isValidName('my-123')   // => true
 */

function isValidName(elName: string): boolean {
  return !!(elName.indexOf('-') !== -1 && elName.match(/^[a-z][a-z0-9-]*$/))
}

/**
 * Shadow DOM is not supported with the Mutation Observer strategy.
 */

export function supportsShadow(): boolean {
  return false
}

/**
 * Checks if a given Node is an HTMLElement.
 *
 * It's possible that a mutation's `addedNodes` return something that isn't an
 * HTMLElement.
 */

function isElement(node: Node | null | undefined): node is HTMLElement {
  return !!node && node.nodeType === 1
}
