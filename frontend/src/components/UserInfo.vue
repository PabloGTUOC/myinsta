<template>
  <div class="user-info">
    <img
      v-if="avatarUrl"
      class="user-info__avatar"
      :src="avatarUrl"
      :alt="fullName"
    />
    <div class="user-info__user">
      <span class="user-info__name">{{ fullName }}</span>
      <span v-if="showUsername" class="user-info__username">@{{ user.username }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { resolveImageUrl } from '../services/api'

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  showUsername: {
    type: Boolean,
    default: true
  }
})

const fullName = computed(() => `${props.user.name} ${props.user.surname}`.trim())
const avatarUrl = computed(() => resolveImageUrl(props.user.profileImg))
</script>

<style scoped>
.user-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.user-info__user {
  display: flex;
  flex-direction: column;
}

.user-info__avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

</style>
