<template>
  <div class="app-shell">
    <Header :is-authenticated="isAuthenticated" />
    <main class="main">
      <router-view />
    </main>
    <BottomMenu
      :is-authenticated="isAuthenticated"
      :username="username"
      :profile-img="profileImg"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSessionStore } from './store/session'
import Header from './components/Header.vue'
import BottomMenu from './components/BottomMenu.vue'

const session = useSessionStore()
const isAuthenticated = computed(() => session.isAuthenticated)
const username = computed(() => session.user?.username || '')
const profileImg = computed(() => session.user?.profileImg || '')
</script>

<style scoped>
.app-shell {
  --primary-color: #ff5a5f;
  --grey-color: #7a7a7a;
  --light-color: #ff8c8f;
  --surface-color: #ffffff;
  --border-color: #e2e2e2;
  --app-bg: #f5f4f2;

  min-height: 100vh;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--app-bg);
}

.main {
  flex: 1;
  overflow-y: auto;
  padding: 0 0 1rem;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  scrollbar-width: none;
}

.main::-webkit-scrollbar {
  width: 0;
  height: 0;
}

@media (max-width: 480px) {
  .main {
    padding: 0.75rem;
  }
}
</style>
