import api from './api'

export const getUser = () => api.get('/user/')

export const updateName = (data) => api.patch('/user/name', { new_name: data.name })

export const updatePhone = (data) => api.patch('/user/phone', { new_phone: data.telephone })

export const updateEmail = (data) => api.patch('/user/email', { new_email: data.email, password: data.password })

export const updatePassword = (data) => api.patch('/user/password', { old_password: data.old_password, new_password: data.new_password })

export const requestDelete = (data) => api.post('/user/delete/request', { password: data.password })

export const confirmDelete = (data) => api.post('/user/delete/confirm', { code: data.code })