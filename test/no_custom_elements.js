// Hides the Custom Elements API so Remount falls back to MutationObserver.
// This must be loaded before any test calls `Remount.define()`.
delete window.customElements
