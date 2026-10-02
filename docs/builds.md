# Builds

Remount ships a single ES Module build (`dist/index.js`) with TypeScript declarations (`dist/index.d.ts`). React and ReactDOM are peer dependencies and are not bundled.

```js
import { define } from 'remount'
```

## Using in browser

Load Remount as a native ES module, using an import map to resolve React. Great for JSFiddle/Codepen. See the [examples](../examples) directory.

```html
<script type="importmap">
  {
    "imports": {
      "react": "https://esm.sh/react@18",
      "react-dom/client": "https://esm.sh/react-dom@18/client"
    }
  }
</script>
<script type="module">
  import { define } from 'https://esm.sh/remount'
</script>
```

## Removed builds

The ES5/UMD build (`remount/es5`, `dist/remount.es5.js`) was removed in v2. If your build tool can't handle modern JavaScript, transpile `remount` as part of your own build.

The `remount/es6` and `remount/esm` builds were deprecated in v0.10.
