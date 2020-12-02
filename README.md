# <samp>p5i</samp>

[p5.js](http://p5js.org/), but with more friendly [instance mode](https://p5js.org/examples/instance-mode-instantiation.html) APIs

- ES6 Destructurable
- Declare first, initialize / reuse later
- Cleaner setup
- TypeScript type definition
- Accessing instance context on `setup` and `draw`

## Motivation

[p5.js](http://p5js.org/) in [global mode](https://github.com/processing/p5.js/wiki/Global-and-instance-mode) is simple, consice and easy-to-use. However, injecting to the global window makes it less flexible in the modern web environment which you may have multiple pages and components with their own lifecycles, so that's why we have the [instance mode](https://p5js.org/examples/instance-mode-instantiation.html). But in the instance mode, you have to prefix every single function with `xxx.`, make it a bit verbose and misaligned with the global mode.

## Install

```bash
npm i p5i
```

## Usage

Before

```js
import P5 from 'p5'

const myp5 = new P5((sketch) => {
  let y = 100

  sketch.setup = () => {
    sketch.createCanvas(720, 400)
    sketch.stroke(255)
    sketch.frameRate(30)
  }

  sketch.draw = () => {
    sketch.background(0)
    y = y - 1
    if (y < 0) {
      y = sketch.height
    }
    sketch.line(0, y, sketch.width, y)
  }
}, document.getElementById('canvas'))
```

After

```js
import { createP5 } from 'p5i'

const sketch = createP5(() => {
  return {
    setup({ createCanvas, stroke, frameRate }) {
      createCanvas(720, 400)
      stroke(255)
      frameRate(30)
    },
    draw({ background, height, width, line }) {
      background(0)
      y = y - 1
      if (y < 0) {
        y = height
      }
      line(0, y, width, y)
    }
  }
)

// you can mount it later
sketch.mount(document.getElementById('canvas'))
```

Or

```js
import { createP5 } from 'p5i'

const { mount, createCanvas, stroke, frameRate, background, line } = createP5()

function setup() {
  createCanvas(720, 400)
  stroke(255)
  frameRate(30)
}

function draw({ height, width }) {
  background(0)
  y = y - 1
  if (y < 0) {
    y = height
  }
  line(0, y, width, y)
}

mount(document.getElementById('canvas'), { setup, draw })
```
