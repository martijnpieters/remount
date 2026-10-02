const expectedStrategy = window.customElements ? 'CustomElements' : 'MutationObserver'

describe('Strategy', () => {
  it(`uses ${expectedStrategy}`, () => {
    expect(Remount.getStrategy().name).toEqual(expectedStrategy)
  })
})
