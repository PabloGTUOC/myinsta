<template>
  <header class="header">
    <div class="header-title">MyInsta</div>
    <router-link v-if="isAuthenticated" class="btn new-post" to="/post/form">
      +
    </router-link>
  </header>
</template>

<script setup>
defineProps({
  isAuthenticated: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.header {
  position: relative;
  padding: 15px;
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  box-shadow: 0px 4px 9px 0px rgba(194, 194, 194, 0.25);
  z-index: 1;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  background: #fff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.header-title {
  pointer-events: none;
}

.btn.new-post {
  position: absolute;
  right: 15px;
  top: 12px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--light-color);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 18px;
  line-height: 1;
}
</style>
