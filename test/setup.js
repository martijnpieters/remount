import * as Remount from '../src/index'
import React from 'react'
import ReactDOM from 'react-dom/client'

globalThis.Remount = Remount
globalThis.React = React
globalThis.ReactDOM = ReactDOM
globalThis.IS_DEBUG = false

beforeEach(() => {
  const root = document.createElement('div')
  document.body.appendChild(root)
  globalThis.root = root
})

afterEach(() => {
  document.body.removeChild(root)
})
