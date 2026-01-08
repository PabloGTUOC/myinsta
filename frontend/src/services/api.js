import axios from 'axios'
import { useSessionStore } from '../store/session'

export const API_BASE_URL = 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE_URL
})

api.interceptors.request.use((config) => {
  const session = useSessionStore()
  if (session.token) {
    config.headers.authorization = session.token
  }
  return config
})

export const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) return ''
  if (imageUrl.startsWith('http')) return imageUrl
  return `${API_BASE_URL}${imageUrl}`
}

export const login = async (username, password) => {
  const { data } = await api.post('/login', { username, password })
  return data
}

export const fetchPosts = async (limit, offset) => {
  const { data } = await api.get('/posts', { params: { limit, offset } })
  return data
}

export const fetchUser = async (username) => {
  const { data } = await api.get(`/user/${username}`)
  return data
}

export const fetchUserPosts = async (username, limit, offset) => {
  const { data } = await api.get(`/user/${username}/posts`, { params: { limit, offset } })
  return data
}

export const fetchPostDetail = async (postId) => {
  const { data } = await api.get(`/post/${postId}`)
  return data
}

export const createPost = async (content) => {
  const { data } = await api.post('/post', { content })
  return data
}

export const editPost = async (postId, content) => {
  const { data } = await api.put(`/post/${postId}`, { content })
  return data
}

export const deletePost = async (postId) => {
  const { data } = await api.delete(`/post/${postId}`)
  return data
}

export const createReply = async (postId, content) => {
  const { data } = await api.post(`/post/${postId}/reply`, { content })
  return data
}

export const uploadImage = async (postId, file) => {
  const formData = new FormData()
  formData.append('image', file)
  const { data } = await api.post(`/post/${postId}/image`, formData)
  return data
}

export default api
