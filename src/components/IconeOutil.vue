<script setup>
defineProps({ outil: { type: Object, required: true }, taille: { type: Number, default: 56 } });
</script>

<template>
  <img :src="`/icones/${outil.id}.svg`" :alt="''" :width="taille" :height="taille" class="icone" loading="lazy" />
</template>

<style scoped>
.icone {
  flex: none;
  filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.4));
}
</style>
