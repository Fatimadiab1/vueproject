<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <img src="@/assets/img/messenger.png" alt="Messenger Logo" class="logo-img" />
      <hr />
    </div>
  
    <div class="user-info">
      <div class="user-details">
        <span class="avatar">{{ getInitials(userData?.username) }}</span>
        <span class="status" :class="{ online: !isDisconnected, offline: isDisconnected }"></span>
        <span class="username">{{ userData?.username }}</span>
      </div>
      <button @click="$emit('logout')" class="logout-btn">
        <i class="fas fa-sign-out-alt"></i>
      </button>
    </div>

    <p class="searchtext">Connected People</p>
    <input v-model="searchQuery" type="text" placeholder="Search People" class="search-bar" />
    
  
    <ul class="user-list" v-if="users.length">
      <li v-for="user in filteredUsers" :key="user.username" class="user">
        <div class="user-avatar">
          <span class="avatar">{{ getInitials(user.username) }}</span>
          <span class="status" :class="{ online: !user.isOffline, offline: user.isOffline }"></span>
        </div>
        <span class="username">{{ user.username }}</span>
      </li>
    </ul>

    <p v-else class="no-users">Aucun utilisateur connecté.</p>
  </aside>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

const props = defineProps(['users', 'userData']);
const emit = defineEmits(['logout']);

const searchQuery = ref('');
const isDisconnected = ref(false);


const getInitials = (fullName) => {
  if (!fullName) return '';

  const parts = fullName.split('.');
  if (parts.length < 2)
   return fullName.charAt(0).toUpperCase();

  return `${parts[0].charAt(0).toUpperCase()}${parts[1].charAt(0).toUpperCase()}`;
};


const filteredUsers = computed(() => {
  return props.users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<style scoped>
.status {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  position: absolute;
  bottom: 0;
  right: 0;
  border: 2px solid white;
}

.status.online {
  background-color: #2ecc71; 
}

.status.offline {
  background-color: red; 
}
</style>
