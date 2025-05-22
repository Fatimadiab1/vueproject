<template>
  <div class="input-area">
    <input 
      v-model="localMessage" 
      type="text" 
      placeholder="Enter your message here" 
      @input="emit('update:message', localMessage)" 
      @keyup.enter="emit('sendMessage')" 
    />
    <button @click="emit('sendMessage')">
      <i class="fas fa-paper-plane"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
  message: String 
});

const emit = defineEmits(['update:message', 'sendMessage']);

const localMessage = ref(props.message);


watch(() => props.message, (newVal) => {
  localMessage.value = newVal;
});
</script>

<style scoped>
.input-area {
  display: flex;
  align-items: center;
}
</style>
