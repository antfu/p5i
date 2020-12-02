# <samp>p5i</samp>

[p5.js](http://p5js.org/), but with more friendly [instance mode](https://p5js.org/examples/instance-mode-instantiation.html) APIs

- ES6 Destructurable
- Declare first, initialize / reuse later
- Cleaner setup
- TypeScript type definition

## Motivation

[p5.js](http://p5js.org/) in [global mode](https://github.com/processing/p5.js/wiki/Global-and-instance-mode) is simple, consice and easy-to-use. However, injecting to the global window makes it less flexible in the modern web environment which you may have multiple pages and components with their own lifecycles, so that's why we have the [instance mode](https://p5js.org/examples/instance-mode-instantiation.html). But in the instance mode, you have to prefix every single function with `xxx.`, make it a bit verbose and misaligned with the global mode.
