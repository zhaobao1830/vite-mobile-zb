<template>
 <div ref="rootRef">
   <slot></slot>
 </div>
</template>

<script setup>
  import useScroll from './use-scroll'
  import { ref } from 'vue'

  const props = defineProps({
    click: {
      type: Boolean,
      default: true
    },
    probeType: {
      type: Number,
      default: 0
    },
    scrollX: {
      type: Boolean,
      default: false
    }
  })

  const emits = defineEmits(['BaseScroll.vue'])

  const rootRef = ref(null)

  const scroll = useScroll(rootRef, props, emits)

  defineExpose({
    scroll
  })
</script>

<style scoped lang="scss">

</style>
