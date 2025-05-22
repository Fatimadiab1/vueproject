<template>
  <div class="login-container">
    <div class="login-box">
      <div class="logo">
        <img src="@/assets/img/messenger.png" alt="Messenger Logo" class="logo-img">
      </div>

      <form @submit.prevent="submitForm">
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <input v-model="user.username" type="text" placeholder="first.last" class="input-field" required>
        <input v-model="user.password" type="password" placeholder="Password" class="input-field" required>

        <button type="submit" class="login-button">LOGIN</button>

        <p class="register-text">
          Not registered yet? 
          <router-link to="/register">Sign up!</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStorage } from '@/composables/UserStorage';

const router = useRouter();
const user = ref({ username: '', password: '' });
const errorMessage = ref('');

const validateUsername = () => {
  const correctname = /^[a-zA-Z]+\.[a-zA-Z]+$/;
  if (!correctname.test(user.value.username)) {
    errorMessage.value = "Username format must be first.last";
    return false;
  }
  return true;
};

const submitForm = async () => {
  if (!validateUsername()) return;

  try {
    const response = await fetch(`http://greenvelvet.alwaysdata.net/kwick/api/login/${user.value.username}/${user.value.password}`);
    const data = await response.json();
    if (data.result.status === 'done') {
      useStorage().storeUserData({ username: user.value.username, userid: data.result.id, token: data.result.token });
      router.push({ name: 'chat' });
    } else {
      errorMessage.value = data.result.message;
    }
  } catch (error) {
    errorMessage.value = "Error during login.";
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.login-box {
  background: transparent;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}

.logo-img {
  width: 200px;
  margin-bottom: 15px;
}

.input-field {
  width: 350px;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.login-button {
  width: 370px;
  padding: 10px;
  background-color: #75cf00;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: ease-in-out 0.5s;
}

.login-button:hover {
  background-color: #165db2;
}

.register-text {
  margin-top: 10px;
  font-size: 14px;
  color: #75cf00;
}

.register-text a {
  color: #75cf00;
  text-decoration: none;
}

.error-message {
  color: red;
  font-size: 14px;
}
</style>
