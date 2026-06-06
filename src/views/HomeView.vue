<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
import Hero from '@/components/Hero.vue';
import Stages from '@/components/Stages.vue';
import Footer from '@/components/Footer.vue';
</script>


<template>
    <div class="bg-cyan-50 dark:bg-slate-900 min-h-screen">
        <Navbar />
        <Hero />
        <Stages />
        <Footer />
    </div>
</template>