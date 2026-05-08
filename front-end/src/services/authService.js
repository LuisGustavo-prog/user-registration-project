import api from './api'

export const register = (data) => {
  return api.post('/auth/register', data)
}

export const login = (data) => {
  return api.post('/auth/login', data)
}

export const requestResetPassword = (data) => api.post('/auth/password/reset/request', data)

export const confirmResetPassword = (data) => api.post('/auth/password/reset/confirm', data)