<template>
  <section>
    <h2>{{ isEdit ? 'Edit post' : 'New post' }}</h2>
    <PostForm
      v-model:content="content"
      :image-preview="imagePreview"
      :submit-label="isEdit ? 'Update' : 'Share'"
      :is-submitting="isSubmitting"
      @submit="handleSubmit"
      @image-change="handleImageChange"
      @remove-image="removeImage"
    >
      <template #avatar>
        <img v-if="userAvatar" :src="userAvatar" alt="User avatar" />
      </template>
    </PostForm>
    <p v-if="error" class="error">{{ error }}</p>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createPost, editPost, fetchPostDetail, resolveImageUrl, uploadImage } from '../services/api'
import { useSessionStore } from '../store/session'
import PostForm from '../components/PostForm.vue'

const route = useRoute()
const router = useRouter()
const session = useSessionStore()

const content = ref('')
const imageFile = ref(null)
const imagePreview = ref('')
const isSubmitting = ref(false)
const error = ref('')

const isEdit = computed(() => Boolean(route.params.id))
const userAvatar = computed(() => resolveImageUrl(session.user?.profileImg))

const loadPost = async () => {
  if (!isEdit.value) return
  try {
    const data = await fetchPostDetail(route.params.id)
    content.value = data.content
  } catch (err) {
    error.value = 'Unable to load post.'
  }
}

const handleImageChange = (file) => {
  if (!file) return
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

const removeImage = () => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
  imageFile.value = null
  imagePreview.value = ''
}

const handleSubmit = async () => {
  if (!content.value.trim()) {
    error.value = 'Content is required.'
    return
  }
  error.value = ''
  isSubmitting.value = true
  try {
    if (isEdit.value) {
      await editPost(route.params.id, content.value)
      if (imageFile.value) {
        await uploadImage(route.params.id, imageFile.value)
      }
      router.push({ name: 'post-detail', params: { id: route.params.id } })
    } else {
      const newPost = await createPost(content.value)
      if (imageFile.value) {
        await uploadImage(newPost.id, imageFile.value)
      }
      router.push({ name: 'post-detail', params: { id: newPost.id } })
    }
  } catch (err) {
    error.value = 'Unable to save post.'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(loadPost)
</script>

<style scoped>
img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
