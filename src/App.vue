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
    <div>
        <RouterView />
    </div>
</template>