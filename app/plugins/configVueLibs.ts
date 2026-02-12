import VueRoughNotation from 'vue-rough-notation';
import { TheChessboard } from 'vue3-chessboard';
import PowerGlitchPlugin from 'vue-powerglitch'
import Fen from 'chess-fen'
import VueDepthViewer from 'vue-depth-viewer'
import { MotionPlugin } from '@vueuse/motion'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VueRoughNotation)
    nuxtApp.vueApp.component('TheChessboard', TheChessboard)
    nuxtApp.vueApp.use(PowerGlitchPlugin)
    nuxtApp.vueApp.component('Fen', Fen)
    nuxtApp.vueApp.component('VueDepthViewer', VueDepthViewer)
    nuxtApp.vueApp.use(MotionPlugin)
})