// Defer until next frame
export function raf() {
  return new Promise((resolve) => {
    // Since React 18, updates sometimes get deferred by 2 animation frames intermittently
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        resolve()
      })
    })
  })
}
