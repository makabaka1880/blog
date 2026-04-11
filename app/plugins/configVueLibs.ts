import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
    if (import.meta.server) return  // 👈 bail out entirely on SSR

    import('vue-rough-notation').then(({ default: VueRoughNotation }) => {
        nuxtApp.vueApp.use(VueRoughNotation)
    })

    import('vue3-chessboard').then(({ TheChessboard }) => {
        nuxtApp.vueApp.component('TheChessboard', TheChessboard)
    })

    import('vue-powerglitch').then(({ default: PowerGlitchPlugin }) => {
        nuxtApp.vueApp.use(PowerGlitchPlugin)
    })

    import('chess-fen').then(({ default: Fen }) => {
        nuxtApp.vueApp.component('Fen', Fen)
    })
})