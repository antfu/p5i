# <samp>p5i</samp>

[p5.js](http://p5js.org/), but with more friendly [instance mode](https://p5js.org/examples/instance-mode-instantiation.html) APIs

- ES6 Destructurable
- Declare first, initialize / reuse later
- Cleaner setup
- TypeScript type definitions
- Accessing instance context on `setup` and `draw`
- Flexible ways to defining your sketches

## Motivation

[p5.js](http://p5js.org/) in [global mode](https://github.com/processing/p5.js/wiki/Global-and-instance-mode) is simple, consice and easy-to-use. However, injecting to the global window makes it less flexible in the modern web environment which you may have multiple pages and components with their own lifecycles, that's the reason we have the [instance mode](https://p5js.org/examples/instance-mode-instantiation.html). Unfortunately, it isn't prefect, in the instance mode, you have to prefix every single function with `xxx.`, make it a bit verbose and misaligned with the global mode.

```ts
new P5((sketch) => {
  sketch.setup = () => {
    sketch.createCanvas(720, 400)
    sketch.frameRate(30)
  }

  sketch.draw = () => {
    sketch.background(0)
    sketch.stroke(255)
  }
}, document.getElementById('canvas'))
```

To get rid of it, you may think of destructuring, but it won't work

```ts
new P5((sketch) => {
  // NO! you can't!
  const { frameRate, createCanvas } = sketch

  sketch.setup = () => {
    // `this` gets lost
    createCanvas(200, 200)
  }
})
```

**p5i** is a wrapper for p5.js to make the API more flexible and friendly to the modern world. It makes the functions in p5 independent from the `this` context and being destructurable. This makes the instance mode more like the global mode while keeps the ability to be isolated and reuseable. See the following example and the type definitions for more details.

## Install

```bash
npm i p5i
```

CDN

```html
<script src="http://unpkg.com/p5i"></script>
```

Functions will be exposed to the global variable `P5I`.

## Usage

<details>
<summary>Before</summary>
<br>

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
    if (y < 0)
      y = sketch.height

    sketch.line(0, y, sketch.width, y)
  }
}, document.getElementById('canvas'))
```

</details>

After

```ts
import { p5i } from 'p5i'

let y = 100

function setup({ createCanvas, stroke, frameRate }) {
  createCanvas(720, 400)
  stroke(255)
  frameRate(30)
}

function draw({ background, line, height, width }) {
  background(0)
  y = y - 1
  if (y < 0)
    y = height

  line(0, y, width, y)
}

p5i({ setup, draw }, document.getElementById('canvas'))
```

Or

```ts
import { P5I, p5i } from 'p5i'

const { mount, createCanvas, stroke, frameRate, background, line } = p5i()

let y = 100

function setup() {
  createCanvas(720, 400)
  stroke(255)
  frameRate(30)
}

// with TypeScript
function draw({ height, width }: P5I) {
  background(0)
  y = y - 1
  if (y < 0)
    y = height

  line(0, y, width, y)
}

mount(document.getElementById('canvas'), { setup, draw })
```

Or

```js
import { p5i } from 'p5i'

const sketch = p5i(() => {
  let y = 100

  return {
    setup({ createCanvas, stroke, frameRate }) {
      createCanvas(720, 400)
      stroke(255)
      frameRate(30)
    },
    draw({ background, height, width, line }) {
      background(0)
      y = y - 1
      if (y < 0)
        y = height

      line(0, y, width, y)
    }
  }
})

// you can mount it later
sketch.mount(document.getElementById('canvas'))
```

<details>
<summary><del>Or if you are fine with non-strict JavaScript</del></summary>
<br>

The [`with` keyword](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/with):

<!-- eslint-skip -->

```js
p5i((sketch) => {
  let y = 100

  with (sketch) {
    function setup() {
      createCanvas(720, 400)
      stroke(255)
      frameRate(30)
    }

    function draw() {
      background(0)
      y = y - 1
      if (y < 0)
        y = height

      line(0, y, width, y)
    }

    return { setup, draw }
  }
}, document.getElementById('canvas'))
```

</details>

## Sponsors

This project is part of my <a href='https://github.com/antfu-sponsors'>Sponsor Program</a>

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg'/>
  </a>
</p>

## License

MIT
