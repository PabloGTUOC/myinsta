<template>
  <section>
    <div v-if="user" class="user-info">
      <button class="btn--logout" type="button" @click="handleLogout">Log out</button>
      <img class="user-info__avatar" :src="profileAvatar" :alt="user.name" />
      <div class="user-info__user">
        <span>{{ user.name }} {{ user.surname }}</span>
        <span>@{{ user.username }}</span>
      </div>
    </div>
    <div class="posts-list">
      <PostCard v-for="post in posts" :key="post.id" :post="post" :show-user="false" />
    </div>
    <button v-if="hasMore" class="btn load-more" :disabled="loading" @click="loadPosts">
      {{ loading ? 'Loading...' : 'Load more' }}
    </button>
    <p v-if="error" class="error">{{ error }}</p>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchUser, fetchUserPosts } from '../services/api'
import { useSessionStore } from '../store/session'
import PostCard from '../components/PostCard.vue'
import { resolveImageUrl } from '../services/api'

const route = useRoute()
const router = useRouter()
const session = useSessionStore()

const user = ref(null)
const posts = ref([])
const loading = ref(false)
const error = ref('')
const hasMore = ref(true)
const limit = 10

const profileAvatar = computed(() => resolveImageUrl(user.value?.profileImg))

const loadProfile = async () => {
  error.value = ''
  posts.value = []
  hasMore.value = true
  try {
    user.value = await fetchUser(route.params.username)
  } catch (err) {
    error.value = 'Unable to load user profile.'
  }
}

const loadPosts = async () => {
  if (loading.value || !hasMore.value) return
  loading.value = true
  error.value = ''
  try {
    const data = await fetchUserPosts(route.params.username, limit, posts.value.length)
    if (!data || !data.result) {
      hasMore.value = false
      return
    }
    posts.value.push(...data.result)
    hasMore.value = posts.value.length < data.paginator.total
  } catch (err) {
    if (err.response?.status === 204) {
      hasMore.value = false
    } else {
      error.value = 'Unable to load posts.'
    }
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  session.clearSession()
  router.push({ name: 'login' })
}

onMounted(async () => {
  await loadProfile()
  await loadPosts()
})

watch(
  () => route.params.username,
  async () => {
    await loadProfile()
    await loadPosts()
  }
)
</script>

<style scoped>
.user-info {
  display: grid;
  place-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
  position: relative;
}

.user-info__avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.btn--logout {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.posts-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.btn.load-more {
  margin: 10px auto;
  min-width: 200px;
  display: block;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  padding: 8px 12px;
}

</style>
