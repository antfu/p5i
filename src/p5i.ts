/* eslint-disable no-use-before-define */
import type P5 from 'p5'
import { functionNames } from './functionNames'
import { optionNames } from './optionNames'
import * as CONSTANTS from './constants'

let p5: any

const isClient = typeof window !== 'undefined'

if (isClient)
  p5 = require('p5')

export declare type P5I = P5 & Helpers

type Helpers = {
  mount(el: HTMLElement, options?: P5IOptions): void
  unmount(): void
  setup?: (p5i: P5I) => void
  draw?: (p5i: P5I) => void
}

export type OptionNames = (typeof optionNames)[number]
export type P5IOptions = Partial<Record<OptionNames, (p5i: P5I) => void>>

export function p5i(fnOrOptions?: P5IOptions | ((p5i: P5I) => P5IOptions | void), el?: HTMLElement | undefined): P5I {
  let instance: P5 | undefined
  const options: P5IOptions = {
    setup() {},
  }

  const helpers: Helpers = {
    unmount() {
      if (!isClient)
        return

      if (instance) {
        instance.remove()
        instance = undefined
      }
    },
    mount(el, _options) {
      if (!isClient)
        return proxy

      helpers.unmount()

      // eslint-disable-next-line no-new, new-cap
      new p5((_instance: P5) => {
        instance = _instance

        if (fnOrOptions)
          Object.assign(options, (typeof fnOrOptions === 'function' ? fnOrOptions(proxy) : fnOrOptions) || {})

        if (_options)
          Object.assign(options, _options)

        for (const key of optionNames) {
          if (options[key])
            instance![key] = () => options[key]?.(proxy)
        }
      }, el)

      return proxy
    },
  }

  const proxy: P5I = new Proxy<any>(helpers, {
    get(_, p: string, r) {
      const helper = Reflect.get(helpers, p, r)
      if (helper)
        return helper
      if (functionNames.includes(p)) {
        // @ts-ignore
        return (...args) => {
          if (!instance)
            throw new Error(`can not "${p}" access before mounting`)
          // @ts-ignore
          return instance[p](...args)
        }
      }
      // @ts-ignore
      if (CONSTANTS[p] != null)
        // @ts-ignore
        return CONSTANTS[p]

      if (!instance)
        throw new Error(`can not "${p}" access before mounting`)
      return Reflect.get(instance, p, r)
    },
    set(_, p: string, v) {
      if (optionNames.includes(p as OptionNames)) {
        // @ts-ignore
        options[p] = v
        return true
      }

      if (!instance)
        throw new Error(`can not "${p}" access before mounting`)

      return Reflect.set(instance, p, v)
    },
  }) as P5I

  if (el)
    helpers.mount(el)

  return proxy
}

export const createP5 = p5i
