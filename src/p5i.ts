import P5 from 'p5'

// eslint-disable-next-line no-use-before-define
export type P5i = P5 & Helpers

type Helpers = {
  mount(el: HTMLElement): void
  unmount(): void
  setup?: (p5i: P5i) => void
  draw?: (p5i: P5i) => void
}

export interface P5iOptions {
  setup?: (p5i: P5i) => void
  draw?: (p5i: P5i) => void
}

export function createP5(fn?: (p5i: P5i) => P5iOptions | void, el?: HTMLElement | undefined): P5i {
  let instance: P5 | undefined
  const options: P5iOptions = {}

  const helpers: Helpers = {
    unmount() {
      if (instance) {
        instance.remove()
        instance = undefined
      }
    },
    mount(el) {
      helpers.unmount()

      instance = new P5(() => {}, el)

      if (fn)
        Object.assign(options, fn(proxy) || {})

      instance.setup = () => options.setup?.(proxy)
      instance.draw = () => options.draw?.(proxy)

      return proxy
    },
  }

  const proxy: P5i = new Proxy<any>(helpers, {
    get(_, p: string, r) {
      const helper = Reflect.get(helpers, p, r)
      if (helper)
        return helper
      if (!instance)
        throw new Error(`can not "${p}" access before mounting`)
      const v = Reflect.get(instance, p, r)
      if (typeof v === 'function')
        return v.bind(instance)
      return v
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
  }) as P5i

  if (el)
    helpers.mount(el)

  return proxy
}
