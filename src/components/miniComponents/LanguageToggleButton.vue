<script lang="ts" setup>
import { computed, ref } from "vue"
import i18n from "../../../i18n";
import { useI18n } from "vue-i18n";
const changeLanguage = (lang: string) => {
  i18n.global.locale = lang as any
  localStorage.setItem("lang", lang)

  // document.documentElement.setAttribute(
  //   "dir",
  //   lang === "ar" ? "rtl" : "ltr"
  // )
}

const { locale } = useI18n()
const open = ref(false)

const languages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ar', label: 'العربية', flag: 'ar' },
]
const currentLang = computed(() =>
  languages.find(l => l.code === locale.value) ?? languages[0]
)

function select(code: string) {
  locale.value = code
  open.value = false
}


</script>


<template>
    <div class="relative">
        <button @click="open = !open"
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-slate-700">
            <span>{{ currentLang?.flag }}</span>
            <span>{{ currentLang?.label }}</span>
            <svg class="w-3 h-3 text-gray-400 transition-transform duration-200" :class="open ? 'rotate-180' : ''"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z" />
            </svg>
        </button>

        <div v-if="open"
            class="absolute right-0 mt-1 w-36 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 shadow-lg z-50 overflow-hidden">
            <button v-for="lang in languages" :key="lang.code" @click="select(lang.code)"
                class="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                :class="locale === lang.code ? 'text-blue-500 font-medium' : 'text-gray-700 dark:text-gray-300'">
                <span>{{ lang.flag }}</span>
                <span>{{ lang.label }}</span>
            </button>
        </div>
    </div>
</template>