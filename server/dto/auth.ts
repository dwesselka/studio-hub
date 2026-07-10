export interface AuthUserResponse {
  id: string
  email: string
  name: string
  role: string
  credits: number
  plan: string
  businessName: string | null
  businessSegment: string | null
  businessAddress: string | null
  businessPhone: string | null
  businessLogo: string | null
  onboardingCompleted: boolean
}

export interface LoginResponse {
  user: AuthUserResponse
  accessToken: string
  refreshToken: string
}

export interface SignupResponse {
  user: AuthUserResponse
  accessToken: string
  refreshToken: string
}

export interface RefreshResponse {
  user: AuthUserResponse
  accessToken: string
  refreshToken: string
}

export function toAuthUserResponse(user: {
  id: string
  email: string
  name: string
  role: string
  credits: number
  plan: string
  businessName: string | null
  businessSegment: string | null
  businessAddress: string | null
  businessPhone: string | null
  businessLogo: string | null
  onboardingCompleted: boolean
}): AuthUserResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    credits: user.credits,
    plan: user.plan,
    businessName: user.businessName,
    businessSegment: user.businessSegment,
    businessAddress: user.businessAddress,
    businessPhone: user.businessPhone,
    businessLogo: user.businessLogo,
    onboardingCompleted: user.onboardingCompleted,
  }
}
