import VueRoughNotation from 'vue-rough-notation';
import { TheChessboard } from 'vue3-chessboard';
import PowerGlitchPlugin from 'vue-powerglitch'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VueRoughNotation)
    nuxtApp.vueApp.component('TheChessboard', TheChessboard)
    nuxtApp.vueApp.use(PowerGlitchPlugin)
})