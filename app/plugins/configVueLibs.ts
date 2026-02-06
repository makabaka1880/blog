import VueRoughNotation from 'vue-rough-notation';
import { TheChessboard } from 'vue3-chessboard';
import VueFreezeGif from 'vue-freeze-gif';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VueRoughNotation)
    nuxtApp.vueApp.component('TheChessboard', TheChessboard)
    nuxtApp.vueApp.component('freeze', VueFreezeGif)
})