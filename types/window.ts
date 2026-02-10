declare global {
    interface Window {
        twikoo?: {
            init: (options: {
                envId: string
                el: string
            }) => void
        }
    }
}
