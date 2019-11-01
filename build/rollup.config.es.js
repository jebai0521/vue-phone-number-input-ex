import base from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    name: 'vue-phone-number-input',
    file: 'dist/vue-phone-number-input.esm.js',
    format: 'es',
  },
  external: [
    'libphonenumber-js',
  ],
})

export default config
