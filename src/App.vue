<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useThemeStore } from './stores/theme';
import { onMounted } from 'vue';

const theme = useThemeStore()

onMounted(() => {
    theme.initTheme()
})
</script>

<template>
    <div class="min-h-screen bg-cyan-200 dark:bg-slate-900">
        <RouterView />
    </div>
</template>