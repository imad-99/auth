import Keycloak, {KeycloakProfile} from 'keycloak-js';
import {AuthService, UserInfo} from './auth.service';

export interface KeycloakAuthServiceConfig {
  url: string
  realm: string
  clientId: string
}

export class KeycloakAuthService extends AuthService {
  private readonly keycloak: Keycloak
  private readonly init: Promise<void>
  private initCompleted: boolean
  private userInfo?: UserInfo

  constructor(keycloakAuthServiceConfig: KeycloakAuthServiceConfig) {
    super()
    this.keycloak = new Keycloak({url: keycloakAuthServiceConfig.url, realm: keycloakAuthServiceConfig.realm, clientId: keycloakAuthServiceConfig.clientId})
    this.init = this.initSso()
    this.initCompleted = false
    void this.init
  }

  private async initSso(): Promise<void> {
    await this.keycloak.init({onLoad: 'check-sso'})
    this.initCompleted = true
  }

  private async waitTillInitCompletes(): Promise<void> {
    if (this.initCompleted) {
      return;
    }

    await this.init
  }

  public async login(): Promise<void> {
    await this.waitTillInitCompletes()
    return this.keycloak.login()
  }

  public async getAuthToken(): Promise<string | undefined> {
    await this.waitTillInitCompletes()
    if (this.keycloak.token) {
      await this.keycloak.updateToken()
      return this.keycloak.token
    }
    return undefined
  }

  public async getUserInfo(): Promise<UserInfo | undefined> {
    await this.waitTillInitCompletes()
    if (this.userInfo) {
      return this.userInfo
    }

    if (this.keycloak.authenticated) {
      const keycloakUserProfile: KeycloakProfile = await this.keycloak.loadUserProfile()
      this.userInfo = {
        username: keycloakUserProfile.username,
        email: keycloakUserProfile.email,
      }
      return this.userInfo
    }
    return undefined
  }

  public async logout(): Promise<void> {
    await this.waitTillInitCompletes()
    await this.keycloak.logout()
  }
}
