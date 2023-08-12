import { autoDash } from '~/utils/helpers'

export default function (_, inject) {
  inject('autoDash', (text) => autoDash(text))
}
