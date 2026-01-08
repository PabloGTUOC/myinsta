<template>
  <article class="post">
    <RouterLink v-if="showUser" :to="`/profile/${post.user.username}`">
      <UserInfo :user="post.user" />
    </RouterLink>
    <component :is="linkToDetail ? 'RouterLink' : 'div'" v-bind="linkProps">
      <div class="post-detail">
        <p>{{ post.content }}</p>
        <time>{{ formattedDate }}</time>
      </div>
      <div v-if="post.imageUrl" class="post-image">
        <img :src="resolvedImage" alt="Post image" />
      </div>
    </component>
    <div class="interactions">
      <span class="icon">Replies {{ post.nReplies || 0 }}</span>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { resolveImageUrl } from '../services/api'
import UserInfo from './UserInfo.vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  showUser: {
    type: Boolean,
    default: true
  },
  linkToDetail: {
    type: Boolean,
    default: true
  }
})

const resolvedImage = computed(() => resolveImageUrl(props.post.imageUrl))
const formattedDate = computed(() => new Date(props.post.publishDate).toLocaleString())
const linkProps = computed(() => (props.linkToDetail ? { to: `/post/${props.post.id}` } : {}))
</script>

<style scoped>
.post:not(:last-child) {
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
}

.post {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #fff;
  position: relative;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
}

.post a {
  text-decoration: none;
  color: inherit !important;
}

.post-detail {
  margin-bottom: 10px;
}

.post-detail p {
  margin: 0;
  font-size: 14px;
  margin-bottom: 8px;
}

.post-detail time {
  font-size: 12px;
}

.post-image {
  width: 100%;
  margin: 8px 0;
  border-radius: 8px;
  overflow: hidden;
}

.post-image img {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: contain;
  display: block;
}

.interactions {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}

.interactions .icon {
  font-size: 12px;
  color: #555;
}
</style>
