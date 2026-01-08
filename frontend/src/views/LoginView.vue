<template>
  <section>
    <form @submit.prevent="handleLogin">
      <h1>Welcome back</h1>
      <label>
        Username
        <input v-model.trim="username" type="text" placeholder="Username" required />
      </label>
      <label>
        Password
        <input v-model="password" type="password" placeholder="Password" required />
      </label>
      <button type="submit" :disabled="isSubmitting">Log in</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../services/api'
import { useSessionStore } from '../store/session'

const router = useRouter()
const session = useSessionStore()

const username = ref('')
const password = ref('')
const error = ref('')
const isSubmitting = ref(false)

const handleLogin = async () => {
  error.value = ''
  isSubmitting.value = true
  try {
    const data = await login(username.value, password.value)
    session.setSession(data.user, data.token)
    router.push({ name: 'profile', params: { username: data.user.username } })
  } catch (err) {
    error.value = 'Invalid username or password.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
form {
  display: grid;
  place-items: center;
  gap: 20px;
}

</style>
