export abstract class AuthService {
  abstract login(): Promise<void>
  abstract getAuthToken(): Promise<string | undefined>
  abstract logout(): Promise<void>
}
