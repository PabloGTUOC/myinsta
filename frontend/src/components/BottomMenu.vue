<template>
  <nav class="menu">
    <router-link class="menu-link" :class="{ active: isActive('/') }" to="/">
      Home
    </router-link>
    <router-link
      v-if="isAuthenticated"
      class="menu-link"
      :class="{ active: isProfileActive }"
      :to="profilePath"
    >
      <img v-if="profileImgUrl" class="profile-img" :src="profileImgUrl" alt="Profile" />
      Profile
    </router-link>
    <router-link v-else class="menu-link" :class="{ active: isActive('/login') }" to="/login">
      Login
    </router-link>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { resolveImageUrl } from '../services/api'

const props = defineProps({
  isAuthenticated: {
    type: Boolean,
    default: false
  },
  username: {
    type: String,
    default: ''
  },
  profileImg: {
    type: String,
    default: ''
  }
})

const route = useRoute()
const isActive = (path) => route.path === path
const profilePath = computed(() => (props.username ? `/profile/${props.username}` : '/'))
const isProfileActive = computed(() => props.username && route.path.includes(`/profile/${props.username}`))
const profileImgUrl = computed(() => (props.profileImg ? resolveImageUrl(props.profileImg) : ''))
</script>

<style scoped>
.menu {
  display: flex;
  justify-content: space-around;
  padding: 15px;
  border-top: 1px solid #ddd;
  background: white;
  border-end-end-radius: 20px;
  border-end-start-radius: 20px;
  box-shadow: 0px -4px 9px 0px rgba(194, 194, 194, 0.25);
  z-index: 1;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
}

.menu-link {
  text-decoration: none;
  color: inherit;
  background: none;
  border: none;
  font-size: 25px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--grey-color);
}

.menu-link.active {
  color: var(--primary-color);
}

.profile-img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}
</style>
