import axios from 'axios'

const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach token to every request
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// Global error handler
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const login = (email: string, password: string) =>
  api.post<{ success: boolean; data: { access_token: string; token_type: string; user: any }; message: string }>('/auth/login', { email, password })

export const getMe = () => api.get('/auth/me')

export const getKpis = (period = '30d') => api.get(`/dashboard/kpis?period=${period}`)
export const getRevenue = (period = '30d') => api.get(`/dashboard/revenue?period=${period}`)
export const getCategories = (period = '30d') => api.get(`/dashboard/categories?period=${period}`)
export const getTopProducts = (period = '30d', limit = 10) => api.get(`/dashboard/top-products?period=${period}&limit=${limit}`)
export const getRecentOrders = (limit = 10) => api.get(`/dashboard/recent-orders?limit=${limit}`)
export const getInsights = (period = '30d') => api.get(`/dashboard/insights?period=${period}`)
export const getInventoryAlerts = () => api.get('/dashboard/inventory-alerts')

export const getSales = (params: Record<string, string | number> = {}) => {
  const qs = new URLSearchParams(params as Record<string, string>).toString()
  return api.get(`/sales?${qs}`)
}
export const createSale = (data: any) => api.post('/sales', data)
export const updateSale = (id: number, data: any) => api.put(`/sales/${id}`, data)
export const deleteSale = (id: number) => api.delete(`/sales/${id}`)

export const getProducts = (params: Record<string, string> = {}) => {
  const qs = new URLSearchParams(params).toString()
  return api.get(`/products?${qs}`)
}
export const createProduct = (data: any) => api.post('/products', data)
export const updateProduct = (id: number, data: any) => api.put(`/products/${id}`, data)
export const deleteProduct = (id: number) => api.delete(`/products/${id}`)

export const getCustomers = (params: Record<string, string> = {}) => {
  const qs = new URLSearchParams(params).toString()
  return api.get(`/customers?${qs}`)
}
export const getCustomerOrders = (id: number) => api.get(`/customers/${id}/orders`)

export const getAnalyticsRevenue = (period = '30d') => api.get(`/analytics/revenue?period=${period}`)
export const getAnalyticsCategories = (period = '30d') => api.get(`/analytics/categories?period=${period}`)
export const getAnalyticsProducts = (period = '30d') => api.get(`/analytics/products?period=${period}`)
export const getAnalyticsRegions = (period = '30d') => api.get(`/analytics/regions?period=${period}`)
export const getAnalyticsCustomers = (period = '30d') => api.get(`/analytics/customers?period=${period}`)

export const getReportsSales = (params: Record<string, string> = {}) => {
  const qs = new URLSearchParams(params).toString()
  return api.get(`/reports/sales?${qs}`)
}
export const exportReportSales = (params: Record<string, string> = {}) => {
  const qs = new URLSearchParams({ ...params, export: 'true' }).toString()
  return api.get(`/reports/sales?${qs}`)
}

export const importSales = (formData: FormData) =>
  api.post('/import/sales', formData, { headers: { 'Content-Type': 'multipart/form-data' } })

export const getSettings = () => api.get('/settings')
export const updateSetting = (key: string, value: string) => api.put(`/settings/${key}`, { value })
