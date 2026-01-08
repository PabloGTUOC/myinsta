<template>
  <div class="form-post">
    <div class="form-post__image">
      <slot name="avatar"></slot>
    </div>
    <form class="form-post__form" @submit.prevent="handleSubmit">
      <textarea
        :value="content"
        placeholder="What's happening?"
        rows="4"
        @input="onInput"
      ></textarea>
      <div v-if="imagePreview" class="image-preview">
        <img :src="imagePreview" alt="Selected" />
        <button type="button" class="remove-image" @click="emit('remove-image')">x</button>
      </div>
      <div class="form-actions">
        <label class="image-upload-btn">
          Add image
          <input type="file" accept="image/*" @change="onFileChange" />
        </label>
        <button class="btn--share" type="submit" :disabled="isSubmitting">
          {{ submitLabel }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  imagePreview: {
    type: String,
    default: ''
  },
  submitLabel: {
    type: String,
    default: 'Share'
  },
  isSubmitting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:content', 'submit', 'image-change', 'remove-image'])

const onInput = (event) => {
  emit('update:content', event.target.value)
}

const onFileChange = (event) => {
  const [file] = event.target.files
  emit('image-change', file)
}

const handleSubmit = () => {
  emit('submit')
}
</script>

<style scoped>
.form-post {
  display: flex;
  flex-direction: row;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  position: relative;
  align-items: flex-start;
  gap: 10px;
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
  font-family: inherit;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.form-post__form textarea:focus {
  outline: none;
}

.image-preview {
  position: relative;
  margin-bottom: 10px;
  border-radius: 8px;
  overflow: hidden;
  max-width: 100%;
}

.image-preview img {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: cover;
  display: block;
}

.remove-image {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  font-size: 16px;
  font-weight: bold;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.image-upload-btn {
  background-color: var(--light-color);
  color: white;
  font-size: 14px;
}

.image-upload-btn:hover {
  filter: brightness(1.2);
}

.image-upload-btn input {
  display: none;
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
