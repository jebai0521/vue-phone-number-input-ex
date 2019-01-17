<template>
  <div
    :class="{ 'dark': dark }"
    class="vue-phone-number-input flex"
  >
    <div class="select-country-container">
      <CountrySelector
        ref="CountrySelector"
        v-model="countryCode"
        :items="codesCountries"
        :color="color"
        :error="(!countryCode && !!phoneNumber)"
        :hint="phoneNumber ? 'Choose country' : null"
        :dark="dark"
        :disabled="disabled"
        :valid="isValid"
        :preferred-countries="preferredCountries"
        :only-countries="onlyCountries"
        :ignored-countries="ignoredCountries"
        label="Country Code"
        class="input-country-selector"
      />
    </div>
    <div class="flex-1">
      <VueInputUI
        ref="PhoneNumberInput"
        v-model="phoneNumber"
        label="Phone number"
        :hint="countryCode && phoneNumber ? phoneFormatted : null"
        :color="color"
        :dark="dark"
        :disabled="disabled"
        :valid="isValid"
        class="input-phone-number"
        @focus="$emit('phone-number-focused')"
      />
    </div>
  </div>
</template>
<script>
  /* eslint-disable */
  import CodesCountries from './assets/js/phoneCodeCountries.js'
  import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js'
  import VueInputUI from 'vue-input-ui'
  import 'vue-input-ui/dist/vue-input-ui.css'
  import CountrySelector from './_subs/CountrySelector'

  export default {
    name: 'VuePhoneNumberInput',
    components: {
      VueInputUI,
      CountrySelector
    },
    props: {
      value: { type: String, default: null },
      color: { type: String, default: 'dodgerblue' },
      dark: { type: Boolean, default: Boolean },
      disabled: { type: Boolean, default: Boolean },
      defaultCountryCode: { type: String, default: null },
      preferredCountries: { type: Array, default: null },
      onlyCountries: { type: Array, default: null },
      ignoredCountries: { type: Array, default: null }
    },
    data () {
      return {
        results: {}
      }
    },
    mounted () {
      if (this.value && this.defaultCountryCode) {
        this.emitValue({ phoneNumber: this.phoneNumber, countryCode: this.countryCode})
      }
    },
    computed: {
      codesCountries () {
        return CodesCountries
      },
      countryCode: {
        get () {
          return this.results.countryCode || this.defaultCountryCode
        },
        set (newCountry) {
          this.emitValue({countryCode: newCountry, phoneNumber: this.phoneNumber})
          this.$refs.PhoneNumberInput.$el.querySelector('input').focus()
        }
      },
      phoneNumber: {
        get () {
          return this.value
        },
        set (newPhone) {
          this.$emit('input', newPhone)
          this.emitValue({countryCode: this.countryCode, phoneNumber: newPhone})
        }
      },
      phoneFormatted () {
        const asYouType = new AsYouType(this.countryCode).input(this.phoneNumber)
        return this.results.isValid ? this.results.formatInternational : asYouType
      },
      isValid () {
        return this.results.isValid
      }
    },
    methods: {
      getParsePhoneNumberFromString ({ phoneNumber, countryCode }) {
        const parsing = phoneNumber && countryCode ? parsePhoneNumberFromString(phoneNumber, countryCode) : null
        return {
          phoneNumber: phoneNumber ? phoneNumber : null,
          countryCode: countryCode,
          isValid: false,
          ...( parsing
            ? { 
              formattedNumber: parsing.number,
              nationalNumber: parsing.nationalNumber,
              isValid: parsing.isValid(),
              type: parsing.getType(),
              formatInternational: parsing.formatInternational(),
              formatNational: parsing.formatNational(),
              uri: parsing.getURI()
            }
            : null
          )
        }
      },
      emitValue (payload) {
        this.results = this.getParsePhoneNumberFromString(payload)
        this.$emit('update', this.results)
      }
    }
  }
</script>
<style lang="scss">
  @import "./assets/scss/flexbox-helper.scss";
  @import "./assets/flags/flags.css";
  *, *::before, *::after {
    box-sizing: border-box;
  }
  .vue-phone-number-input {
    font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen,
        Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    .select-country-container {
      flex: 0 0 130px;
      width: 130px;
      min-width: 130px;
      max-width: 130px;
    }
    .country-selector {
      cursor: pointer;
    }
    .select-country-container {
      margin-right: -1px;
      .input-country-selector input {
        border-top-right-radius: 0 !important; 
        border-bottom-right-radius: 0 !important;
      }
    }
    .input-phone-number input {
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
    }
    &:not(.dark) {
      .input-phone-number input {
        background-color: transparent !important;
      }
    }
  }
</style>