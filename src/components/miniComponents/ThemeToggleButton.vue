<script lang="ts" setup>
import { useThemeStore } from "@/stores/theme";
const theme = useThemeStore()
</script>


<template>
    <button @click="theme.toggleTheme()" :aria-label="theme.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        :class="[
            'relative cursor-pointer w-16 h-8 rounded-full transition-colors duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
            theme.isDark ? 'bg-slate-700' : 'bg-sky-200'
        ]">
        <!-- Sun icon (left side) -->
        <span class="absolute left-1.5 top-1/2 -translate-y-1/2 text-amber-400 transition-opacity duration-300"
            :class="theme.isDark ? 'opacity-40' : 'opacity-100'">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                <path
                    d="M10 4.5A5.5 5.5 0 1 0 10 15.5A5.5 5.5 0 1 0 10 4.5zM10 3c.441 0 .799-.447.799-1V1c0-.553-.358-1-.799-1s-.801.447-.801 1v1c0 .553.359 1 .801 1m0 14c-.442 0-.801.447-.801 1v1c0 .553.359 1 .801 1c.441 0 .799-.447.799-1v-1c0-.553-.358-1-.799-1M1 9.199C.447 9.199 0 9.558 0 10s.447.799 1 .799h1c.551 0 1-.358 1-.799 0-.441-.449-.801-1-.801zm17 0c-.553 0-1 .359-1 .801c0 .441.447.799 1 .799h1c.552 0 1-.357 1-.799 0-.441-.449-.801-1-.801zm-1.344-6.819l-.699.699c-.391.391-.454.961-.142 1.273s.883.248 1.273-.143l.7-.699c.391-.391.454-.961.142-1.273s-.883-.248-1.274.143zM3.334 15.533l-.7.701c-.391.391-.454.959-.142 1.271s.883.25 1.272-.141l.7-.699c.391-.391.454-.961.142-1.274s-.883-.247-1.272.142m.431-12.898c-.39-.391-.961-.455-1.273-.143s-.248.883.141 1.274l.7.699c.391.391.96.455 1.272.143s.249-.883-.141-1.273zm11.769 14.031l.7.699c.391.391.96.453 1.272.143c.312-.312.249-.883-.142-1.273l-.699-.699c-.391-.391-.961-.455-1.274-.143s-.248.882.143 1.273" />
            </svg>
        </span>

        <!-- Moon icon (right side) -->
        <span class="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-300 transition-opacity duration-300"
            :class="theme.isDark ? 'opacity-100' : 'opacity-40'">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 25 24" fill="currentColor">
                <path
                    d="M2.226 12c0-5.523 4.477-10 10-10h1.734l-.868 1.5c-.579 1-.866 2.189-.866 3.5a7 7 0 0 0 8.348 6.87l1.682-.327-.543 1.626A10 10 0 0 1 12.227 22c-5.523 0-10-4.477-10-10" />
            </svg>
        </span>

        <!-- Knob -->
        <span :class="[
            'absolute top-1 w-6 h-6 rounded-full transition-all duration-500 shadow-md',
            theme.isDark
                ? '-translate-x-7 bg-slate-600'
                : 'translate-x-1 bg-white'
        ]" />
    </button>
</template>