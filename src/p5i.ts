/* eslint-disable no-use-before-define */
import P5 from 'p5'
import { functionNames } from './functionNames'

export type P5I = P5 & Helpers

type Helpers = {
  mount(el: HTMLElement, options?: P5IOptions): void
  unmount(): void
  setup?: (p5i: P5I) => void
  draw?: (p5i: P5I) => void
}

export interface P5IOptions {
  setup?: (p5i: P5I) => void
  draw?: (p5i: P5I) => void
}

export function createP5(fnOrOptions?: P5IOptions | ((p5i: P5I) => P5IOptions | void), el?: HTMLElement | undefined): P5I {
  let instance: P5 | undefined
  const options: P5IOptions = {}

  const helpers: Helpers = {
    unmount() {
      if (instance) {
        instance.remove()
        instance = undefined
      }
    },
    mount(el, _options) {
      helpers.unmount()

      // eslint-disable-next-line no-new
      new P5((_instance) => {
        instance = _instance

        if (fnOrOptions)
          Object.assign(options, (typeof fnOrOptions === 'function' ? fnOrOptions(proxy) : fnOrOptions) || {})

        if (_options)
          Object.assign(options, _options)

        instance!.setup = () => options.setup?.(proxy)
        instance!.draw = () => options.draw?.(proxy)
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
      if (!instance)
        throw new Error(`can not "${p}" access before mounting`)
      return Reflect.get(instance, p, r)
    },
    set(_, p: string, v) {
      if (['setup', 'draw'].includes(p)) {
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
