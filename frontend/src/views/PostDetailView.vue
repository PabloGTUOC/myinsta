<template>
  <section class="view-post-detail">
    <div v-if="post" class="main-post">
      <div v-if="canEdit" class="actions-wrapper">
        <button class="action-btn" type="button" @click="goToEdit">Edit</button>
        <button class="action-btn" type="button" @click="handleDelete">Delete</button>
      </div>
      <PostCard :post="post" :link-to-detail="false" />
    </div>

    <form v-if="showReplyForm" class="form-post" @submit.prevent="submitReply">
      <img
        v-if="userAvatar"
        class="form-post__image"
        :src="userAvatar"
        alt="User avatar"
      />
      <div class="form-post__form">
        <textarea v-model.trim="replyContent" rows="3" placeholder="Write a reply..." required></textarea>
        <div class="form-actions">
          <button class="btn--share" type="submit" :disabled="isSubmitting">Reply</button>
        </div>
      </div>
    </form>

    <div v-if="post?.replies?.length" class="replies-list">
      <h3>Replies</h3>
      <ul>
        <li v-for="reply in post.replies" :key="reply.id">
          <UserInfo :user="reply.user" />
          <p>{{ reply.content }}</p>
          <time>{{ formatDate(reply.publishDate) }}</time>
        </li>
      </ul>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createReply, deletePost, fetchPostDetail, resolveImageUrl } from '../services/api'
import { useSessionStore } from '../store/session'
import PostCard from '../components/PostCard.vue'
import UserInfo from '../components/UserInfo.vue'

const route = useRoute()
const router = useRouter()
const session = useSessionStore()

const post = ref(null)
const error = ref('')
const replyContent = ref('')
const isSubmitting = ref(false)
const showReplyForm = ref(true)

const canEdit = computed(() => {
  if (!post.value || !session.user) return false
  return post.value.userId === session.user.id
})
const userAvatar = computed(() => resolveImageUrl(session.user?.profileImg))

const loadPost = async () => {
  error.value = ''
  try {
    post.value = await fetchPostDetail(route.params.id)
  } catch (err) {
    error.value = 'Unable to load post.'
  }
}

const submitReply = async () => {
  if (!replyContent.value) return
  isSubmitting.value = true
  error.value = ''
  try {
    await createReply(route.params.id, replyContent.value)
    replyContent.value = ''
    showReplyForm.value = false
    await loadPost()
  } catch (err) {
    error.value = 'Unable to send reply.'
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async () => {
  error.value = ''
  try {
    await deletePost(route.params.id)
    router.push({ name: 'home' })
  } catch (err) {
    error.value = 'Unable to delete post.'
  }
}

const goToEdit = () => {
  router.push({ name: 'post-form', params: { id: route.params.id } })
}

const formatDate = (date) => new Date(date).toLocaleString()

onMounted(loadPost)
</script>

<style scoped>
.view-post-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-post {
  border: 1px solid #ddd;
  border-radius: 8px;
}

.actions-wrapper {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-right: 10px;
}

.action-btn {
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  padding: 6px 12px;
  cursor: pointer;
}

.replies-list {
  margin-left: 20px;
}

.replies-list li:not(:last-child) {
  border-bottom: 1px solid #ddd;
}

.form-post {
  display: flex;
  flex-direction: row;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  position: relative;
}

.form-post__image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.form-post__form {
  flex: 1;
}

.form-post__form textarea {
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: 0;
  resize: none;
  margin-bottom: 10px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.btn--share {
  margin-left: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  padding: 6px 12px;
  cursor: pointer;
}

</style>
