import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    'src/constants.ts',
  ],
})
  .removeRules(
    'ts/ban-ts-comment',
    'no-new',
  )
