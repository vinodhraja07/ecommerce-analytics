export interface User {
  id: number
  name: string
  email: string
  role: string
}

export interface LoginResponse {
  success: boolean
  data: {
    access_token: string
    token_type: string
    user: User
  }
  message: string
}
