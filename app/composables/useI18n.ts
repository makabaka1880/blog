import { computed } from 'vue'
import { messages, type Locale } from '@/i18n'

const locale = ref<Locale>('en')

export function useI18n() {
  const t = computed(() => {
    return (key: string) => {
      const keys = key.split('.')
      let value: any = messages[locale.value]
      for (const k of keys) {
        value = value?.[k]
      }
      return value || key
    }
  })

  const setLocale = (newLocale: Locale) => {
    locale.value = newLocale
  }

  return {
    t,
    locale,
    setLocale
  }
}