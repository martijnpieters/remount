import { expect } from 'vitest'

describe('Inception mode', () => {
  let div

  beforeEach(() => {
    div = document.createElement('div')
    root.appendChild(div)
  })

  afterEach(() => {
    if (!IS_DEBUG) root.removeChild(div)
  })

  it('works', () => {
    const Inner = ({ name }) => {
      return (
        <span>
          Inside
          {name}
        </span>
      )
    }

    Remount.define({ 'x-mauve': Inner }, { attributes: ['name'] })

    const Outer = () => {
      return (
        <blockquote>
          <span>Outside</span>
          <x-mauve name={'Hello'} />
        </blockquote>
      )
    }

    const root = ReactDOM.createRoot(div)
    root.render(<Outer />)

    // The outer and inner React roots render in separate scheduler passes, so
    // a fixed number of frames is not enough to be reliable.
    return expect.poll(() => div.textContent).toEqual('OutsideInsideHello')
  })
})
