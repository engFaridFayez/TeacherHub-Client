<script setup lang="ts">
import { ref } from "vue";
import ThemeToggleButton from "./miniComponents/ThemeToggleButton.vue";
import LanguageToggleButton from "./miniComponents/LanguageToggleButton.vue";
const isOpen = ref(false)

</script>

<template>
  <nav class="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex justify-between items-center h-16">

        <!-- Logo -->
        <div class="text-xl font-bold text-gray-800 dark:text-white">
          MyApp
        </div>

        <!-- Desktop Links -->
        <div class="hidden md:flex items-center gap-6">
          <router-link to="/" class="text-gray-700 dark:text-gray-200 hover:text-blue-500">
            {{ $t('nav.home') }}
          </router-link>

          <router-link to="/login" class="text-gray-700 dark:text-gray-200 hover:text-blue-500">
            {{ $t('nav.login') }}
          </router-link>

          <router-link to="/register" class="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">
            {{ $t('nav.sign') }}
          </router-link>

          <ThemeToggleButton />
          <LanguageToggleButton />
        </div>
        <button @click="isOpen = !isOpen" class="md:hidden text-gray-700 dark:text-white text-2xl">
          ☰
        </button>
      </div>
    </div>
    <!-- Mobile Menu -->
    <div v-if="isOpen" class="md:hidden px-4 pb-4 space-y-2">
      <router-link to="/" class="block">{{ $t('nav.home') }}</router-link>
      <router-link to="/login" class="block">{{ $t('nav.login') }}</router-link>
      <router-link to="/register" class="block">{{ $t('nav.sign') }}</router-link>
      <ThemeToggleButton />
      <LanguageToggleButton />
    </div>
  </nav>
</template>