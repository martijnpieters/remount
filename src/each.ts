/**
 * Some implementations of MutationObserver don't have .forEach,
 * so we need our own `forEach` shim. This is usually the case with
 * polyfilled environments.
 */

function each<T>(list: ArrayLike<T>, fn: (item: T) => void): void {
  for (let i = 0, len = list.length; i < len; i++) {
    fn(list[i])
  }
}

export default each
