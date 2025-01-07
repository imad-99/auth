export interface UserInfo {
  username: string | undefined
  email: string | undefined
}

export abstract class AuthService {
  abstract login(): Promise<void>
  abstract getAuthToken(): Promise<string | undefined>
  abstract getUserInfo(): Promise<UserInfo | undefined>
  abstract logout(): Promise<void>
}
