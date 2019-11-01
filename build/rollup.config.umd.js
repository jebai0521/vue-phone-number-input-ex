import base from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    exports: 'named',
    name: 'vue-phone-number-input',
    file: 'dist/vue-phone-number-input.umd.js',
    format: 'umd',
  },
})

export default config
