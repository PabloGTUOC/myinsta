<template>
  <section>
    <div class="posts-list">
      <PostCard v-for="post in posts" :key="post.id" :post="post" />
    </div>
    <button v-if="hasMore" class="btn load-more" :disabled="loading" @click="loadPosts">
      {{ loading ? 'Loading...' : 'Load more' }}
    </button>
    <p v-if="error" class="error">{{ error }}</p>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { fetchPosts } from '../services/api'
import PostCard from '../components/PostCard.vue'

const posts = ref([])
const loading = ref(false)
const error = ref('')
const hasMore = ref(true)
const limit = 10

const loadPosts = async () => {
  if (loading.value || !hasMore.value) return
  loading.value = true
  error.value = ''
  try {
    const data = await fetchPosts(limit, posts.value.length)
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

onMounted(loadPosts)
</script>

<style scoped>
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
