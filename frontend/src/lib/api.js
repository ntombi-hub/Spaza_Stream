import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const getInventory = (shopId) => api.get(`/inventory/${shopId}`).then(r => r.data)
export const getBulkOrders = () => api.get('/bulk-orders').then(r => r.data)
export const getDeliveryRoute = (id) => api.get(`/delivery-route/${id}`).then(r => r.data)
export const getShops = () => api.get('/shops').then(r => r.data)
export const uploadVoiceNote = (shopId, file) => {
  const form = new FormData()
  form.append('shop_id', shopId)
  form.append('audio', file)
  return api.post('/voice-note', form).then(r => r.data)
}
