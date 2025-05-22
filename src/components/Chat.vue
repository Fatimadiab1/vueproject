<template>
  <div class="chat-container">
    <Sidebar :users="users" :userData="userData" @logout="logout" />
    <ChatWindow 
      :messages="messages" 
      :userData="userData" 
      :newMessage="newMessage"
      @update:newMessage="updateMessage"
      @sendMessage="sendMessage"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import ChatWindow from '@/components/ChatWindow.vue';
import { useStorage } from '@/composables/UserStorage';

const users = ref([]);
const messages = ref([]);
const newMessage = ref('');
const userData = ref(null);
let messageInterval = null;
let userInterval = null;


const fetchUsers = async () => {
  if (!userData.value || !userData.value.token) return;
  try {
    const response = await fetch(`http://greenvelvet.alwaysdata.net/kwick/api/user/logged/${userData.value.token}`);
    const data = await response.json();
    
    if (data.result.status === 'done') {
      const onlineUsers = data.result.user;

      users.value = users.value.map(user => ({
        ...user,
        isOffline: !onlineUsers.includes(user.username) 
      }));

   
      onlineUsers.forEach(username => {
        if (!users.value.some(user => user.username === username)) {
          users.value.push({ username, isOffline: false });
        }
      });
    }
  } catch (error) {
    console.error("Erreur récupération utilisateurs:", error);
  }
};


const fetchMessages = async () => {
  if (!userData.value || !userData.value.token) return;
  try {
    const response = await fetch(`http://greenvelvet.alwaysdata.net/kwick/api/talk/list/${userData.value.token}/0`);
    const data = await response.json();
    if (data.result.status === 'done') {
      messages.value = data.result.talk.sort((a, b) => a.timestamp - b.timestamp).slice(-1000);
    }
  } catch (error) {
    console.error("Erreur récupération messages:", error);
  }
};


const sendMessage = async () => {
  if (!newMessage.value.trim()) return;
  if (!userData.value || !userData.value.token) return;

  try {
    const url = `http://greenvelvet.alwaysdata.net/kwick/api/say/${userData.value.token}/${userData.value.userid}/${encodeURIComponent(newMessage.value)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.result.status === 'done') {
      newMessage.value = ''; 
      setTimeout(fetchMessages, 500);
    } else {
      console.error("Error", data.result.message);
    }
  } catch (error) {
    console.error("Error", error);
  }
};


const updateMessage = (value) => {
  newMessage.value = value;
};

const logout = async () => {
  try {
    await fetch(`http://greenvelvet.alwaysdata.net/kwick/api/logout/${userData.value.token}/${userData.value.userid}`);
    useStorage().clearUserData();
    window.location.href = '/login';
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
  }
};

onMounted(() => {
  userData.value = useStorage().getUserData();
  if (userData.value) {
    fetchUsers();
    fetchMessages();
    messageInterval = setInterval(fetchMessages, 5000);
    userInterval = setInterval(fetchUsers, 5000);
  } else {
    window.location.href = '/login';
  }
});

onBeforeUnmount(() => {
  clearInterval(messageInterval);
  clearInterval(userInterval);
});
</script>

<style scoped>
.chat-container {
    display: flex;
    height: 100vh;
}
</style>
