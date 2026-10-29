<script setup lang="ts">
import { onMounted } from 'vue';
import { useStageStore } from '@/stores/stage';
const stageStore = useStageStore()

onMounted(() =>{
    stageStore.getAll();
});

</script>

<template>
<h1>Stage</h1>

<div v-for="stage in stageStore.stages" :key="stage.id">
    <h2>{{stage.name}}</h2>
    <h5>{{stage.description}}</h5>
</div>
</template>

<style scoped>

</style>