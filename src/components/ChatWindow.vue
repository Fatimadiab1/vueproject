<template>
  <main class="chat-window">
    <div class="chat-title">
      <h2>Open Chat</h2>
    </div>
    <div class="messages" v-if="messages.length">
      <div v-for="msg in messages" :key="msg.timestamp" 
           :class="['message', msg.user_name === userData?.username ? 'sent' : 'received']">
        <span class="avatar">{{ getInitials(msg.user_name) }}</span>
        <div class="message-content">{{ msg.content }}</div>
      </div>
    </div>
    <div v-else class="no-messages">
      <p>Aucun message pour le moment.</p>
    </div>
    
    <MessageInput 
      :message="newMessage" 
      @update:message="emit('update:newMessage', $event)" 
      @sendMessage="emit('sendMessage')" 
    />
  </main>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import MessageInput from './MessageInput.vue';

const props = defineProps(['messages', 'userData', 'newMessage']);
const emit = defineEmits(['sendMessage', 'update:newMessage']);

const getInitials = (fullName) => {
  if (!fullName) return '';

  const parts = fullName.split('.');
  if (parts.length < 2) return fullName.charAt(0).toUpperCase();

  return `${parts[0].charAt(0).toUpperCase()}${parts[1].charAt(0).toUpperCase()}`;
};
</script>

<style scoped>
.no-messages {
  text-align: center;
  padding: 20px;
  color: #888;
}
</style>

