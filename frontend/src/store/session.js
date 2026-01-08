import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', {
  state: () => ({
    user: null,
    token: ''
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token)
  },
  actions: {
    setSession(user, token) {
      this.user = user
      this.token = token
    },
    clearSession() {
      this.user = null
      this.token = ''
    }
  }
})
